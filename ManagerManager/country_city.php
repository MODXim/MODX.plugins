<?php
header('Content-Type: application/json; charset=utf-8');

$database_type = "";
$database_server = "";
$database_user = "";
$database_password = "";
$dbase = "";
$table_prefix = "";
$base_url = "";
$base_path = "";

$dir = dirname(__FILE__);
if(isset($dir) && file_exists($dir.'/manager/includes/protect.inc.php')){
	require_once $dir.'/manager/includes/protect.inc.php'; 
	if (!$rt = @include_once $dir."/manager/includes/config.inc.php") {
		return;
    }
}else{
	return;
}

define('MODX_API_MODE', true); 
require_once(MODX_BASE_PATH.'manager/includes/document.parser.class.inc.php'); 
$modx = new DocumentParser; 

$modx->db->connect(); 
$modx->getSettings();
startCMSSession();

$mode = isset($_GET['mode'])?$_GET['mode']:'country';
$r = array();
switch ($mode) {
  case 'country':
    $r = $modx->db->makeArray($modx->db->select('id, title', $modx->getFullTableName('country'),'', 'title ASC'));
    break;
  case 'city':
    $country_id = isset($_GET['country_id'])?intval($_GET['country_id']):0;
    $r = $modx->db->makeArray($modx->db->select('id, title', $modx->getFullTableName('city'), 'country_id = '.$country_id, 'title ASC'));
    break;
}
return json_encode($r);
?>