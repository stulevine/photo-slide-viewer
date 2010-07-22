#!/usr/bin/perl
#
use HTML::Mason::ApacheHandler;
use Data::Dumper;
use CGI::Carp qw(fatalsToBrowser); 
use CGI;
use Cwd;

$mh = HTML::Mason::Interp->new;

$q = new CGI;

print $q->header;
print "<HTML><HEAD></HEAD><BODY><H2>";
print "Remote IP Address is: $ENV{REMOTE_ADDR}";
print "<pre>";
print Dumper($mh);
print "</pre>";
print "</h2></body></html>";
exit;
