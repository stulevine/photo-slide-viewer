#!/usr/bin/perl -w

# author : sergey s prozhogin (ccpro@rrelaxo.org.ru)
# script renames file by EXIF date
# for information start perl rename.pl
#
# v 1.3 May-20-2004
#
BEGIN {
    eval 'use lib ("Image-ExifTool-7.89/blib/lib")';
}

use strict;
use Image::ExifTool qw(:Public);
use Data::Dumper;

my $file = $ARGV[0];
#my $dir = $ARGV[1];
my $key = $ARGV[1] || 'DateTimeOriginal';

#chdir $dir;

#my %options;

#my $exifTool = new Image::ExifTool;
#$exifTool->ExtractInfo($file, \%options);

#print join "\n", keys %$info;

#foreach my $k (sort keys %$info) {
#    print "$k : $info->{$k}\n";
#}

#$exifTool->SetNewValue("History" => "One of the famous cabins along Mormon Row in Grand Tetons National Park");
#my $success = $exifTool->WriteInfo($file, 'bing.jpg');
#print "Success: $success\n";
#print "continue: ";<stdin>;

my $info = ImageInfo($file);

print "$key : $info->{$key}\n";

#foreach my $k (sort keys %$info) {
#    print "$k : $info->{$k}\n";
#}

exit;
