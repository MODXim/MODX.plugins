//<?php

/***********************************
http://modx-shopkeeper.ru/
Andchir (http://wdevblog.net.ru)
---------------------------------
addWebUserFields 1.0
plugin for MODx (1.x.x) + Shopkeeper (0.9.x)
---------------------------------
System Events:
OnWUsrFormRender, OnWUsrFormSave
***********************************/

defined('IN_MANAGER_MODE') or die();

$manager_language = $modx->config['manager_language'];
$charset = $modx->config['modx_charset'];
$dbname = $modx->db->config['dbase'];
$dbprefix = $modx->db->config['table_prefix'];
$p_table = $dbprefix."web_user_additdata";

define('AWUF_PATH',MODX_BASE_PATH."assets/plugins/addWebUserFields/");

if(file_exists(AWUF_PATH."lang/".$manager_language.".php")){
  require AWUF_PATH."lang/".$manager_language.".php";
}

$e = &$modx->Event;
$output = '';

if($e->name == 'OnWUsrFormRender'){
  
  $user_id = isset($id) ? $id : 0;
  
  //
  if (mysql_num_rows(mysql_query("show tables from $dbname like '$p_table'"))==0){
    $sql[] = "CREATE TABLE `$p_table` (`webuser` INT(11) NOT NULL, `setting_name` VARCHAR(50) NOT NULL default '', `setting_value` TEXT)";
    foreach ($sql as $line){
      $modx->db->query($line);
    }
  }
  
  $result = $modx->db->select("*", $p_table, "webuser = '$user_id'", "setting_name ASC");
  
  if($modx->db->getRecordCount($result) > 0){
    
    
    //show additional fields
    $output .= '
    <div class="sectionHeader">'.$langTxt['addit_fields'].'</div>
    <div class="sectionBody">
    <table border="0" cellspacing="0" cellpadding="3">
    ';
    
    while($row = $modx->db->getRow($result,'assoc')){
      
      $output .= "\n<tr>\n<td>".(isset($langTxt[$row['setting_name']]) ? $langTxt[$row['setting_name']] : $row['setting_name']).":</td>\n";
      $output .= '<td><input class="inputBox" type="text" name="addit__'.$row['setting_name'].'" value="'.$row['setting_value'].'" /></td></tr>';
      
    }
    
    $output .= "\n</table>\n</div>\n";
  
  }
  
  $e->output($output);

}

if($e->name == 'OnWUsrFormSave'){
  
  $mode = isset($mode) ? $mode : '';
  $user_id = isset($id) ? $id : 0;  
  
  $a_fields = '';
  
  //update fields
  foreach($_POST as $key => $value){
    if(strpos($key,'addit__')!==false){
      $result = $modx->db->update("setting_value = '$value'", $p_table , "webuser = '$user_id' AND setting_name = '".str_replace('addit__','',$key)."'");
    }
  }
  
}


?>