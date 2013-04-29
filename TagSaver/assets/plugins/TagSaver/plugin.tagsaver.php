//<?php
/**
 * TagSaver
 *
 * @category   plugin,DocLister
 * @version 	0.1
 * @license 	GNU General Public License (GPL), http://www.gnu.org/copyleft/gpl.html
 * @internal    @properties &tv=ID TV-параметра;input; &sep=Разделитель тегов;input;
 * @internal	@events  OnDocFormSave
 * @internal	@modx_category Manager and Admin
 * @author Agel_Nash <Agel_Nash@xaker.ru>
 */
 
if($modx->Event->name=='OnDocFormSave'){
	$id=(int)$modx->Event->params['id'];
  $tv = isset($tv) ? (int)$tv : 0;
  $sep=isset($sep) ? $sep : "";
  $item=array();
  $out=array('new','del');
  
  if($tv>0 && $id>0){
		$sql=$modx->db->query("SELECT value FROM ".$modx->getFullTableName("site_tmplvar_contentvalues")." WHERE contentid='".$id."' AND tmplvarid = ".$tv);
    if($modx->db->getRecordCount($sql)==1){
      $sql=$modx->db->getValue($sql);
      if($sep!=''){
				$item=explode($sep,$sql);
      }else{
      	$item=array($sql);
      }
      
      foreach($item as $tmp){
      	$tmp=trim($tmp);
        if($tmp!=''){
        	$out['new'][]=$modx->db->escape($tmp);
        }
      }
      
			if(count($out['new'])>0){
				$modx->db->query("INSERT IGNORE into ".$modx->getFullTableName("tags")." (`name`) VALUES ('".implode("'),('",array_values($out['new']))."')");
        $sql=$modx->db->query("SELECT id FROM ".$modx->getFullTableName("tags")." WHERE name IN('".implode("','",array_values($out['new']))."')");
        $sql=$modx->db->makeArray($sql);
        $tmp=array();
        foreach($sql as $item){
          $tmp[]="(".$id.",".$item['id'].",".$tv.")";
        }
        $modx->db->query("INSERT IGNORE into ".$modx->getFullTableName("site_content_tags")." (`doc_id`,`tag_id`,`tv_id`) values ".implode(",",$tmp));
			}
      
      $sql=$modx->db->query("SELECT t.id,t.name FROM ".$modx->getFullTableName("tags")." as t LEFT JOIN ".$modx->getFullTableName("site_content_tags")." as ct ON ct.tag_id=t.id WHERE ct.doc_id='".$id."' AND ct.tv_id='".$tv."'");
			$sql=$modx->db->makeArray($sql);
			foreach($sql as $item){
        if(!in_array($item['name'],$out['new'])){
        	$out['del'][$item['id']]=$item['name'];
        }
			}
      if(count($out['del'])>0){
        $modx->db->query("DELETE FROM ".$modx->getFullTableName("site_content_tags")." WHERE doc_id = '".$id."' AND tag_id IN (".implode(",",array_keys($out['del'])).") AND tv_id = '".$tv."'");
        $modx->db->query("DELETE t FROM ".$modx->getFullTableName("tags")." as t LEFT JOIN ".$modx->getFullTableName("site_content_tags")." as ct ON ct.tag_id=t.id WHERE t.id IN (".implode(",",array_keys($out['del'])).") AND ct.doc_id IS NULL");  
			}
    }
	}
}