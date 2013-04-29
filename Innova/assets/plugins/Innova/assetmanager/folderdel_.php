<?
$sMsg = "";
$domen="ваш_домен.ru";
$stop=strpos($_SERVER["HTTP_REFERER"], $domen);

if(isset($_POST["inpCurrFolder"])&& $stop==true)
	{
	$sDestination = pathinfo($_POST["inpCurrFolder"]);
	
	//DELETE ALL FILES IF FOLDER NOT EMPTY
    $dir = $_POST["inpCurrFolder"];
    $handle = opendir($dir); 
    while($file = readdir($handle)) if($file != "." && $file != "..") unlink($dir . "/" . $file); 
    closedir($handle); 
	
	if(rmdir($_POST["inpCurrFolder"])==0)
		$sMsg = "";
	else
		$sMsg = "<script>document.write(getTxt('Folder deleted.'))</script>";
	}
?>
<base target="_self">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="style.css" rel="stylesheet" type="text/css">
<script>

  var sLang=parent.oUtil.langDir;

  document.write("<scr"+"ipt src='language/"+sLang+"/folderdel_.js'></scr"+"ipt>");

</script>

<script>writeTitle()</script>

<script>

function refresh()

  {

    (opener?opener:openerWin).refreshAfterDelete(document.getElementById("inpDest").value);

  }

</script>

</head>
<body onload="loadTxt()" style="overflow:hidden;margin:0px;">

<table width=100% height=100% align=center style="" cellpadding=0 cellspacing=0 ID="Table1">
<tr>
<td valign=top style="padding-top:5px;padding-left:15px;padding-right:15px;padding-bottom:12px;height=100%">

	<br>
	<input type="hidden" ID="inpDest" NAME="inpDest" value="<? echo $sDestination['dirname']; ?>">
	<div><b><? echo $sMsg; ?>&nbsp;</b></div>

</td>
</tr>
<tr>
<td class="dialogFooter" style="height:45px;padding-right:10px;" align=right valign=middle>
	<input type="button" name="btnCloseAndRefresh" id="btnCloseAndRefresh" value="close & refresh" onclick="refresh();self.close();" class="inpBtn" onmouseover="this.className='inpBtnOver';" onmouseout="this.className='inpBtnOut'">
</td>
</tr>
</table>


</body>
</html>