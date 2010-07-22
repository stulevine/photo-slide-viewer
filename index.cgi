#!/usr/bin/perl
#
use strict;
use CGI;
use CGI::Carp qw(fatalsToBrowser); 
use Cwd;
use HTML::Template;

require "config.pl";
our %sizes;
my $q = new CGI;
my $workingdirectory = getcwd();

my $d = $q->param('d') || "X-Country Adventures 2009";
my $ss = $q->param('u');
my $tmpl = $q->param('t') || 'index3.tmpl';
my $update = $q->param('update') || 0;
my $home = $workingdirectory;
my $tmpl = HTML::Template->new(filename => $tmpl);

$d =~ s/^\/|\.\.\/|\~|\`//g;
die("The directory specified is invalid") unless(-e $d);

my $regx = join "",keys %sizes;

$ss = 1 unless($ss =~ /[${regx}]/);

$tmpl->param(GALLERY => $d);
$tmpl->param(U => $ss);
$tmpl->param(UPDATE => $update);
$tmpl->param(SIZE   => $sizes{$ss}+6);

print $q->header;
print $tmpl->output;

exit;
