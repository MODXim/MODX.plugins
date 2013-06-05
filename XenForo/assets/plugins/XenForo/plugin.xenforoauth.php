//<?php
/**
 * XenForo auth
 *
 * @category   plugin,XenForo
 * @version 	0.2
 * @license 	GNU General Public License (GPL), http://www.gnu.org/copyleft/gpl.html
 * @internal    @properties &folderKey=Folder key;text;forum_folder&forum_folder=folder;text;forum
 * @internal	@events  OnWebPageInit
 * @internal	@modx_category Auth
 * @author Agel_Nash <Agel_Nash@xaker.ru>
 */
 
if(!function_exists('sanitarTag')){
	function sanitarTag($data){
		$data = htmlspecialchars($data);
        return str_replace(array('[', ']', '{', '}'), array('&#91;', '&#93;', '&#123;', '&#125;'),$data);
    }
}

if(!function_exists('genPass')){
/**
     * Password generate
     *
     * @category   generate
     * @version   0.1
     * @license 	GNU General Public License (GPL), http://www.gnu.org/copyleft/gpl.html
     * @param string $len длина пароля
     * @param string $data правила генерации пароля
     * @return string Строка с паролем
     * @author Agel_Nash <Agel_Nash@xaker.ru>
     *
     * Расшифровка значений $data
     * "A": A-Z буквы
     * "a": a-z буквы
     * "0": цифры
     * ".": все печатные символы
     *
     * @example
     * $this->genPass(10,"Aa"); //nwlTVzFdIt
     * $this->genPass(8,"0"); //71813728
     * $this->genPass(11,"A"); //VOLRTMEFAEV
     * $this->genPass(5,"a0"); //4hqi7
     * $this->genPass(5,"."); //2_Vt}
     * $this->genPass(20,"."); //AMV,>&?J)v55,(^g}Z06
     * $this->genPass(20,"aaa0aaa.A"); //rtvKja5xb0\KpdiRR1if
     */
    function genPass($len,$data=''){
        if($data==''){
            $data='Aa0.';
        }
        $opt=strlen($data);
        $pass=array();

        for($i=$len;$i>0;$i--){
            switch($data[rand(0,($opt-1))]){
                case 'A':{
                    $tmp=rand(65,90);
                    break;
                }
                case 'a':{
                    $tmp=rand(97,122);
                    break;
                }
                case '0':{
                    $tmp=rand(48,57);
                    break;
                }
                default:{
                $tmp=rand(33,126);
                }
            }
            $pass[]=chr($tmp);
        }
        $pass=implode("",$pass);
        return $pass;
    }
}

if($modx->event->name == 'OnWebPageInit'){
	$folderKey = !empty($folderKey) ? $folderKey : 'forum_folder';
	$forumFolder = !empty($modx->config[$folderKey]) ? $modx->config[$folderKey] : (!empty($$folderKey) ? $$folderKey : 'forums');
	$fileDir=$modx->config['base_path'].$forumFolder.'/';
	
	$password = '';
	
	$startTime = microtime(true);
	require_once ($fileDir . '/library/XenForo/Autoloader.php');
	XenForo_Autoloader::getInstance()->setupAutoloader($fileDir . '/library');
		
	XenForo_Modx::initialize($fileDir . '/library', $fileDir);
	XenForo_Modx::set('page_start_time', $startTime);
	XenForo_Session::startPublicSession();
		
	$xfUser = XenForo_Visitor::getInstance();
	$uId = 0;
	if($xfUser->get('user_id')!==0 && $xfUser->get('email')!==''){
		$qe = $modx->db->query("SELECT internalKey FROM ".$modx->getFullTableName('web_user_attributes')." WHERE email='".$modx->db->escape($xfUser->get('email'))."'");
		$qe = (int)$modx->db->getValue($qe);
		$qu = $modx->db->query("SELECT id,password FROM ".$modx->getFullTableName('web_users')." WHERE username='".$xfUser->get('username')."'");
		$qu = $modx->db->getRow($qu);
		if($qe>0 && $qe == $qu['id']){
			$password = $qu['password'];
			$uId = $qu;
		}else{
			$password = genPass(20,".");
			$uId=$modx->db->insert(array(
				'username'=>$modx->db->escape(sanitarTag($modx->stripTags($xfUser->get('username')))),
				'password'=>$password; //@TODO password generate
			),$modx->getFullTableName("web_users"));
			if($uId>0){
				$uId=$modx->db->insert(array(
					'fullname'=>$modx->db->escape(sanitarTag($modx->stripTags($xfUser->get('username')))),
					'email'=>$modx->db->escape(sanitarTag($xfUser->get('email')))
				),$modx->getFullTableName("web_user_attributes"));
				if($uId<=0){
					$modx->logEvent(401,3,$info_mess, 'Не удалось профиль пользователя XforoID '.$xfUser->get('user_id'));
					$modx->sendUnauthorizedPage();
				}
			}else{
				$modx->logEvent(401,3,$info_mess, 'Не удалось создать пользователя XforoID '.$xfUser->get('user_id'));
				$modx->sendUnauthorizedPage();
			}
		}
	}
	
	if($uId>0){
		$_SESSION['webShortname'] = sanitarTag($modx->stripTags($xfUser->get('username')));
		$_SESSION['webFullname'] = $_SESSION['webShortname'];
		$_SESSION['webEmail'] = sanitarTag($modx->stripTags($xfUser->get('email')));
		$_SESSION['webValidated'] = 1;
		$_SESSION['webInternalKey'] = $uId;
		$_SESSION['webValid'] = base64_encode($this->get('password'));
		$_SESSION['webUser'] = base64_encode($xfUser->get('username'));
		$_SESSION['webFailedlogins'] = 0; //@TODO: get Failed Login Count
		$_SESSION['webLastlogin'] = $xfUser->get('last_activity');
		$_SESSION['webnrlogins'] = 0; //@TODO: get Login count
		$_SESSION['webUserGroupNames'] = '';
		if($remember){
			$cookieValue = md5($xfUser->get('username')).'|'.$password;
			$cookieExpires = time() + (60 * 60 * 24 * 365 * 5);
			setcookie('WebLoginPE', $cookieValue, $cookieExpires, '/');
		}
	}else{
		if (isset($_SESSION['mgrValidated'])){
			unset($_SESSION['webShortname']);
			unset($_SESSION['webFullname']);
			unset($_SESSION['webEmail']);
			unset($_SESSION['webValidated']);
			unset($_SESSION['webInternalKey']);
			unset($_SESSION['webValid']);
			unset($_SESSION['webUser']);
			unset($_SESSION['webFailedlogins']);
			unset($_SESSION['webLastlogin']);
			unset($_SESSION['webnrlogins']);
			unset($_SESSION['webUsrConfigSet']);
			unset($_SESSION['webUserGroupNames']);
			unset($_SESSION['webDocgroups']);
			setcookie('WebLoginPE', '', time()-60, '/');
		}else{
			if (isset($_COOKIE[session_name()])){
				setcookie(session_name(), '', 0, '/');
			}
			setcookie('WebLoginPE', '', time()-60, '/');
			session_destroy();
		}
	}
}