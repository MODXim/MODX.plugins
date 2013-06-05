<?php
/**
 * XenForo auth
 *
 * @category    snippet,XenForo
 * @version 	0.2
 * @license 	GNU General Public License (GPL), http://www.gnu.org/copyleft/gpl.html
 * @internal    @properties &folderKey=Folder key;text;forum_folder&forum_folder=folder;text;forum
 * @internal	@events  OnWebPageInit
 * @internal	@modx_category Auth
 * @author Agel_Nash <Agel_Nash@xaker.ru>
 */

$xfUser = XenForo_Visitor::getInstance();
$folderKey = !empty($folderKey) ? $folderKey : 'forum_folder';
$forumFolder = !empty($modx->config[$folderKey]) ? $modx->config[$folderKey] : (!empty($$folderKey) ? $$folderKey : 'forums');

	
$data=array();
$out = '';

if(!function_exists('sanitarTag')){
	function sanitarTag($data){
		$data = htmlspecialchars($data);
        return str_replace(array('[', ']', '{', '}'), array('&#91;', '&#93;', '&#123;', '&#125;'),$data);
    }
}

if($xfUser->get('user_id')=='0'){
	if(isset($tplLogin)){
		$data['back'] = isset($_SERVER['REQUEST_URI']) ? $modx->stripTags($_SERVER['REQUEST_URI']) : '/';
		$data['forumfolder'] = $forumFolder;
		$out = $modx->parseChunk($tplLogin, $data,'[+','+]');
	}
}else if(isset($tplExit)){
    if($xfUser->get('custom_title')==''){
		$title=$modx->db->query("SELECT title FROM xf_user_group WHERE user_group_id='".$modx->db->escape($xfUser->get('user_group_id'))."'");
		$title=$modx->db->getValue($title);
	}else{
		$title=$xfUser->get('custom_title');
	}
	$data['UserName']=$modx->stripTags($xfUser->get('username'));
	$data['UserId']=$xfUser->get('user_id');
	$tmp=array(
		'title'=>sanitarTag($modx->stripTags($title)),
		'username'=>sanitarTag($modx->stripTags($xfUser->get('username'))),
		'user_id'=>$xfUser->get('user_id'),
		'style'=>sanitarTag($modx->stripTags($xfUser->get('display_style_group_id'))),
		'avatar'=>'/'.$forumFolder.'/styles/default/xenforo/avatars/avatar_m.png' //TODO FolderPath
	);
				
	$userInfo=$modx->db->query("SELECT user_id,username,display_style_group_id,message_count,trophy_points,like_count,custom_title,user_group_id,avatar_date,avatar_width,avatar_height,gravatar FROM xf_user WHERE user_id='".$xfUser->get('user_id')."'");
	$userInfo=$modx->db->getRow($userInfo);
	$data['avatar']=sanitarTag(XenForo_Template_Helper_Core::callHelper('avatar', array($userInfo,'m'))); //m
    	
    $privateMsg=$modx->db->query("SELECT count(conversation_id) as allmsg,(SELECT count(is_unread) from xf_conversation_user where owner_user_id='".$xfUser->get('user_id')."' AND is_unread=1) as noread from xf_conversation_user WHERE owner_user_id='".$xfUser->get('user_id')."'");
    $privateMsg=$modx->db->getRow($privateMsg);
	$data['countMessage']=(int)$privateMsg['allmsg'];
    $data['newMessage']=((int)$privateMsg['noread']>0) ? ('+'.$privateMsg['noread']) : '';

    $alert=$modx->db->query("SELECT count('alert_id') from xf_user_alert WHERE alerted_user_id='".$xfUser->get('user_id')."' AND view_date='0'");
    $alert=(int)$modx->db->getValue($alert);
    $data['classAlert']=($alert>0) ? 'new' : 'none';
	$data['countAlert']=($alert>0) ? ('+'.$alert) : '0';

	$data['countBall']=(int)$userInfo['trophy_points'];
	$data['countPost']=(int)$userInfo['message_count'];
	$data['countLike']=(int)$userInfo['like_count'];
	
	$data['forumfolder'] = $forumFolder;
	$out = $modx->parseChunk($tplExit, $data,'[+','+]');
}
return $out;
?>