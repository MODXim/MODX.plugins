//<?php

/*
 *
 * SHKsendSMS plugin for Shopkeeper >= 0.9.6
 * 
 * Configuration:
 * &status1_tpl=Новый - чанк;string;@FILE:assets/plugins/SHKsendSMS/sms_body.tpl &status2_tpl=Принят к оплате - чанк;string;1 &status3_tpl=Отправлен - чанк;string;1 &status4_tpl=Выполнен - чанк;string;1 &status5_tpl=Отменен - чанк;string;1 &status6_tpl=Оплата получена - чанк;string;1
 *   
 * System event:
 * OnSHKChangeStatus
 * 
 */

//defined('IN_MANAGER_MODE') or die();

$sms_serv_path = 'gate.smsbliss.ru/send/';
$sms_serv_protocol = 'http';
$sms_serv_login = '';//логин
$sms_serv_password = '';//пароль
$sms_serv_sender = '';//имя отправителя
$sms_testmode = true;

$chk_order_string = '<b>Хотите получать СМС-сообщения о статусе товара?</b> Да';//строка, которая должна быть в тексте письма с заказом (если её нет, СМС отправляться не будет)
$chk_order_user_fieldname = 'sms__checkbox';//имя доп. поля (чекбокса) для отмечается необходимость отправки СМС
$user_phone_fieldname = 'mphone';//имя доп. поля с телефоном пользователя (таблица "web_user_additdata")

$status_tpl = array();
$status_tpl[1] = isset($status1_tpl) ? $status1_tpl : '@FILE:assets/plugins/SHKsendSMS/sms_body.tpl';
$status_tpl[2] = isset($status2_tpl) ? $status2_tpl : '1';
$status_tpl[3] = isset($status3_tpl) ? $status3_tpl : '1';
$status_tpl[4] = isset($status4_tpl) ? $status4_tpl : '1';
$status_tpl[5] = isset($status5_tpl) ? $status5_tpl : '1';
$status_tpl[6] = isset($status6_tpl) ? $status6_tpl : '1';

$site_name = $modx->config['site_name'];
$site_url = $modx->config['site_url'];

$e = &$modx->Event;

$output = "";

if ($e->name == 'OnSHKChangeStatus') {
  
  $order_id = isset($order_id) ? $order_id : '';
  $status = isset($status) ? intval($status) : '';
  
  $phaseName = array("","Новый","Принят к оплате","Отправлен","Выполнен","Отменен","Оплата получена");
  
  if(!function_exists('fetchTpl')){
  function fetchTpl($tpl){
  	global $modx;
  	$template = "";
  	if(substr($tpl, 0, 6) == "@FILE:"){
  	  $tpl_file = MODX_BASE_PATH . substr($tpl, 6);
  		$template = file_get_contents($tpl_file);
  	}else if(substr($tpl, 0, 6) == "@CODE:"){
  		$template = substr($tpl, 6);
  	}else if($modx->getChunk($tpl) != ""){
  		$template = $modx->getChunk($tpl);
  	}else{
  		$template = false;
  	}
  	return $template;
  }
  }
  
  function translit($str){
    $tr = array(
        "А"=>"A","Б"=>"B","В"=>"V","Г"=>"G",
        "Д"=>"D","Е"=>"E","Ж"=>"J","З"=>"Z","И"=>"I",
        "Й"=>"Y","К"=>"K","Л"=>"L","М"=>"M","Н"=>"N",
        "О"=>"O","П"=>"P","Р"=>"R","С"=>"S","Т"=>"T",
        "У"=>"U","Ф"=>"F","Х"=>"H","Ц"=>"TS","Ч"=>"CH",
        "Ш"=>"SH","Щ"=>"SCH","Ъ"=>"","Ы"=>"Y","Ь"=>"",
        "Э"=>"E","Ю"=>"YU","Я"=>"YA","а"=>"a","б"=>"b",
        "в"=>"v","г"=>"g","д"=>"d","е"=>"e","ж"=>"j",
        "з"=>"z","и"=>"i","й"=>"y","к"=>"k","л"=>"l",
        "м"=>"m","н"=>"n","о"=>"o","п"=>"p","р"=>"r",
        "с"=>"s","т"=>"t","у"=>"u","ф"=>"f","х"=>"h",
        "ц"=>"ts","ч"=>"ch","ш"=>"sh","щ"=>"sch","ъ"=>"y",
        "ы"=>"y","ь"=>"","э"=>"e","ю"=>"yu","я"=>"ya"
    );
    return strtr($str,$tr);
  }

  
  function checkNecessitySend($user_id=0,$order_data='',$chk_string='',$chk_field=''){
    global $modx;
    $output = false;
    if($user_id==0){
      $output = strpos($order_data,$chk_string)!==false ? true : false;
    }else{
      $chk_query = $modx->db->select("id",$modx->getFullTableName('web_user_additdata'),"webuser = '$user_id' AND setting_name = '$chk_field' AND setting_value = '1'");
      $output = $modx->db->getRecordCount($chk_query) ? true : false;
    }
    return $output;
  }
  
  $order_data = $modx->db->getRow($modx->db->select("*",$modx->getFullTableName('manager_shopkeeper'),"id = '$order_id'"),'assoc');
  $phone = $order_data['userid']==0 ? $order_data['phone'] : $modx->db->getValue($modx->db->select('setting_value',$modx->getFullTableName('web_user_additdata'),"webuser = '".$order_data['userid']."' AND setting_name = '$user_phone_fieldname'"));
  $phone = preg_replace('/\D/','',$phone);
  
  if($status_tpl[$status] && checkNecessitySend($order_data['userid'],$order_data['short_txt'], $chk_order_string, $chk_order_user_fieldname)){
    
    if(strlen($status_tpl[$status])==1){
      $chnum = intval($status_tpl[$status]);
      $status_tpl[$status] = $status_tpl[$chnum];
    }
    $body = fetchTpl($status_tpl[$status]);
    $body = preg_replace('/[\r\n]+/','',$body);
    
    $chunkArr = array(
      'orderID' => $order_id,
      'status_name' => $phaseName[$status],
      'site_name' => $site_name,
      'site_url' => $site_url
    );
    
    foreach(array_merge($chunkArr,$order_data) as $key => $value){
      $body = str_replace('[+'.$key.'+]', $value, $body);
    }
    
    $body = strip_tags(translit($body));
    
    //send SMS
    if(strlen($phone)==10 && strlen($body)>0 && !$sms_testmode){
      $ch = curl_init();
      $curl_url = $sms_serv_protocol."://{$sms_serv_login}:{$sms_serv_password}@{$sms_serv_path}?sender={$sms_serv_sender}&phone=+7{$phone}&text=".urlencode($body);
      curl_setopt($ch, CURLOPT_URL, $curl_url);
      curl_setopt($ch, CURLOPT_REFERER, $site_url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
      curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
      $send_result = curl_exec($ch); //save report
      if(curl_errno($ch)){
        echo 'Curl error: ' . curl_error($ch);
        exit;
      }
      curl_close($ch);
    }else{
      $send_result = $sms_testmode ? urlencode("sms_test: $body -> $phone") : '';
    }
    
    $notify_str = $send_result ? "&notify[]=".preg_replace('/[\r\n]+/','',$send_result) : '';
    if($notify_str){
      $modx->sendRedirect("index.php?a=112&id=".$_GET['id'].$notify_str,0,"REDIRECT_HEADER");
    }
    
  }
  
  $e->output($output);

}


//?>