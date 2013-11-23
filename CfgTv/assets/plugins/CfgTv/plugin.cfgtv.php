//<?php
/**
 * CfgTv 0.2
 * Save TV as system setting from some resourse
 *
 *
 * @category    plugin
 * @version     0.2
 * @author      Bumkaka, Agel_Nash
 * @internal    @properties &ids=ID ресурсов настроек;text;347 &prefix=Префикс;text;cfg_
 * @internal    @events OnBeforeDocFormSave
 * @internal    @modx_category Manager and Admin
 */

$e =& $modx->event;
switch ($e->name ) {
    case 'OnBeforeDocFormSave':{
        $list_id=explode(',',$ids);
        if (!in_array($_POST['id'],$list_id)) return;
        $SQL="SELECT * FROM ".$modx->getFullTableName('site_tmplvars').";";
        $result=$modx->db->query($SQL);
        while($row=$modx->db->getRow($result)) {
			$TVNAME[$row['id']]=$row['name'];
		}
        foreach($_POST as $key=>$value){
			if (substr($key,0,2)!='tv') continue;
            $id=substr($key,2,strlen($key));
            $name=$prefix.$TVNAME[$id];
            $value = $modx->db->escape($value);	
            $settings[$name]=$value;
            $SQL="SELECT * FROM ".$modx->getFullTableName('system_settings')." WHERE `setting_name`='".$name."'";
            $count=$modx->db->getRow($modx->db->query($SQL));
			if(is_array($value)) $value = serialize($value);
			if (!empty($count['setting_name'])){
				$SQL="UPDATE ".$modx->getFullTableName('system_settings')." SET `setting_value`='".$value."' WHERE `setting_name`='".$name."'";
				$modx->db->query($SQL);
			} else {
				$SQL="INSERT into ".$modx->getFullTableName('system_settings')." SET `setting_name`='".$name."',`setting_value`='".$value."'";
				$modx->db->query($SQL);
			}
		}
		break ;
	}
}
