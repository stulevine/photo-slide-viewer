#!/usr/bin/perl
#
# Take an original image in parameter 'i' in a folder specified by parameter 'd'
# and create a scaled, processed annotated version for display and cache
#

use strict;
use CGI::Carp qw(fatalsToBrowser); 
use CGI;
use Image::Magick;
use Cwd;

####
# Globals and Parameters
#
require "config.pl";

our %sizes;

my $q = new CGI;

my $photo=$q->param('i');
my $dir=$q->param('d');
my $gamma=$q->param('g') || 1.0;
my $quality=$q->param('q') || 100;
my $saturation=$q->param('s');
my $brightness=$q->param('b');
my $blackness=$q->param('blk');
my $radius=$q->param('sr') || 0.5;
my $threshhold=$q->param('st') || 0.0;
my $amount=$q->param('a') || 0.25;
my $resize=$q->param('rs') || 0;
my $sharpen=$q->param('sh') || 0;
my $ss=$q->param('u');
my $update=$q->param('update') || 0;
my $debug=$q->param('dbg') || 0;

my $regx = join "",keys %sizes;

$ss = 1 unless($ss =~ /[${regx}]/);
		
my $maxwidth = $sizes{$ss};
my $workingdirectory = getcwd();
my $home  = "${workingdirectory}/${dir}";
my $cache = "${workingdirectory}/.cache/${dir}";

####
# some simple checks here before we proceed
#
$dir =~ s/^\/|\.\.\/|\~|\`//g;
$photo =~ s/^\/|\.\.\/|\~|\`//g;

die("Either the directory or image specified is invalid") unless((-e $dir) && (-e "${dir}/${photo}"));

####
# check to see if the cache directory exists
# if not then create it
#
mkdir "$cache" unless(-e $cache);

####
# Let's get a new Image::Magick object to 
# load our photo into
#
my $img = new Image::Magick;
my $x = $img->Read("${home}/${photo}");
warn "$x" if "$x";
my $w = $img->Get('columns');
my $h = $img->Get('rows');
my $nw;
my $nh;

####
# Set up our scaling parameter based on the size 
# selected from $sizes and paramete $ss
#
if($w > $h){
	$nw=$maxwidth;
	$nh=sprintf("%2.2d",($nw/$w) * $h) unless($h == 0);
}else{
	$nh=$maxwidth;
	$nw=sprintf("%2.2d",($nh/$h) * $w) unless($w == 0);
}

####
# All the stuff we need to watermark the image
#
my $sig = "©2010 STU LEVINE PHOTOGRAPHY";
my $ax = $nw-250;
my $ay = $nh-8;

####
# Scale, Sharpen, Annotate process the image
#
$x = $img->Set(quality=>$quality);
$x = $img->Scale(width=>$nw,height=>$nh);
$x = $img->UnsharpMask(radius=>$radius,
                       amount=>$amount,
                       threshold=>$threshhold) if($sharpen);
                       
$img->Modulate(saturation=>$saturation) if ($saturation != undef);
$img->Modulate(brightness=>$brightness) if ($brightness != undef);
$img->Modulate(blackness=>$blackness) if ($blackness != undef);
$img->Gamma(gamma=>$gamma) if ($gamma != undef);

if ($ss <= 4) {
    $x = $img->Annotate(font=>'LithosPro-Black.otf',
                    pointsize=>12,fill=>'AntiqueWhite2',
                    text=>$sig,
                    x=>$ax,
                    y=>$ay,
                    antialias=>'true');
}
####
# convert the image object to a blob so we can output the
# binary stream as image/jpeg content
#
my $blob = $img->ImageToBlob();
my $clength = length($blob);

die("Error occurred creating the blog $!") unless($blob);

####
# Save a copy of the image as a file 
# into the cache if it does not exist
# so next time we can draw from the cache instead
# of going through all the above processing
# Note: this script is called if an image is not 
# already in the cache or being updated
#
if(!(-e "${cache}/${ss}_${photo}") || $update){
	open(C,">${cache}/${ss}_${photo}") || die("Errror occurred opening a file for writing to the image cache");
	binmode C;
	$img->Write(file=>\*C, filename=>"${cache}/${ss}_${photo}");
	close(C);
}

####
# Push out the image
#
print "Content-Type: image/jpeg\n"; 
print "Content-Length: $clength\n\n";

binmode STDOUT;

print $blob;

exit;
