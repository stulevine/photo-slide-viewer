#!/usr/bin/perl
#
BEGIN {
    eval 'use lib ("Image-ExifTool-7.89/blib/lib")';
}

use strict;
use CGI;
use CGI::Carp qw(fatalsToBrowser); 
use Cwd;
#use Image::Magick;
use Image::ExifTool qw(:Public);

require "config.pl";

our %sizes;
my $q = new CGI;
my $workingdirectory = getcwd();

my $d = $q->param('d') || "X-Country Adventures 2009";
my $ss = $q->param('u');
my $update = $q->param('update');
my $tout = $q->param('tout');
my $home = $workingdirectory;
my @files = ();
my $maximages;

$d =~ s/^\/|\.\.\/|\~|\`//g;
die("The directory specified is invalid") unless(-e $d);

my $regx = join "",keys %sizes;

$ss = 1 unless($ss =~ /[${regx}]/);

print $q->header(-type=> $tout ? 'text/plain' : 'text/html');
print buildjsondata($d);

exit;

sub buildjsondata(){
    my($d)=@_;
    
	opendir(DIR,"${home}/$d");
		@files = grep {/.(JPG|jpg)$/} readdir(DIR);
	closedir DIR;

	my $imgcount = 0;
	my %imgsort = ();
    my @filehash = ();
    my $dim = ();
    
    mkdir "${home}/.cache/${d}" unless(-e "${home}/.cache/${d}");

    if(-e "${home}/.cache/${d}/.filehash" && !$update) 
    {
        open(FH,"${home}/.cache/${d}/.filehash");
            @filehash=<FH>;
        close(FH);
    }
    else 
    {
        open(FH,">${home}/.cache/${d}/.filehash");
    	    foreach my $f (@files)
    	    {    	        
                my $info = ImageInfo("${d}/${f}");
                my $cdate = $info->{'DateTimeOriginal'};
                my $w = $info->{ImageWidth};
                my $h = $info->{ImageHeight};
                $cdate =~s/(\:|\ )//g;
                my $no = sprintf("%3.3d",$imgcount);
                my $line = "$f\|${cdate}_${no}|$w|$h";
                print FH $line."\n";
                push(@filehash,$line);
    		    $imgcount++;
            }
        close(FH);
    }
    
    
    foreach my $line (@filehash) 
    {
        chomp($line);
		my ($file,$original_date,$w,$h) = split /\|/, $line;
        $imgsort{$original_date}=$file;
        $dim->{$file} = [$w,$h];
	}

	my $idx=0;
	my @json = ();
	foreach (sort {$a cmp $b} keys %imgsort)
	{
        my $displayname = $imgsort{$_};
        $displayname =~ s/\.(jpg|JPG)//;
	    my $imsrc = -e "${home}/.cache/$d/${ss}_$imgsort{$_}" && $update != 2 ? "/photography/.cache/$d/${ss}_$imgsort{$_}" : "/photography/i.m?d=${d}&i=$imgsort{$_}&u=$ss";
	    push(@json,",\n") if(@json);
        push(@json,qq|$idx : {name: "$displayname", src : "$imsrc", width : $dim->{$imgsort{$_}}[0], height: $dim->{$imgsort{$_}}[1]}|);
		$idx+=1;
	}
	$maximages = $idx;
    unshift(@json,"images = {\n");
    push(@json,qq|,\nimgcount : $maximages\n}|);
    return(@json);
}
