<?
// test mich doch
$CgiUser="nagiosadmin";
$StatusCgi="/usr/local/nagios/sbin/status.cgi";
$Language="german";
$Base=getcwd();
$HTMLBase="https://".$_SERVER['HTTP_HOST']."/nagios/nagvis";
$CgiPath="/usr/local/nagios/sbin/";
$ConfigPath="/usr/local/nagios/etc/";
$RefreshTime="30";
$cfgPath=$Base."/etc/";
$cfgFolder=$Base."/etc/maps/";
$mapFolder=$Base."/maps/";
$iconBaseFolder=$Base."/iconsets/";
$iconHTMLBaseFolder=$HTMLBase."/iconsets/";
$indexInc="index.nagvis.inc";
$defaultIcons="std_small";
$RotateMaps="0";
$maps=array("1");
$Header="1";
$headerCount="3";
$headerInc="header.nagvis.inc";
$version="0.9a5";
$title="NagVis - rain ".$version;
?>
