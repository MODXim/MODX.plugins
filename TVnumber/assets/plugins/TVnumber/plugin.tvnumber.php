<?php
if(!defined('MODX_BASE_PATH')){die('What are you doing? Get out of here!');}

 /**
 * TVnumber
 *
 * @category   plugin
 * @version 	0.1
 * @license 	GNU General Public License (GPL), http://www.gnu.org/copyleft/gpl.html
 * @internal	@events  OnDocFormSave
 * @internal	@modx_category Manager and Admin
 * @author Agel_Nash <Agel_Nash@xaker.ru>
 */
 
if('OnDocFormSave' == $modx->event->name){
	$q=$modx->db->query("SELECT id FROM ".$modx->getFullTableName("site_tmplvars")." WHERE type='number'");
	$q=$modx->db->makeArray($q);
	foreach($q as $value){
		$tv=$modx->db->query("SELECT id,tmplvarid,contentid,value FROM ".$modx->getFullTableName("site_tmplvar_contentvalues")." WHERE tmplvarid='".$value['id']."' AND contentid='".$id."' LIMIT 0,1");
		$tv=$modx->db->getRow($tv);
			
		if(!empty($tv['id'])){
			$tv['value'] = (int)$tv['value'];
			$modx->db->update($tv, $modx->getFullTableName("site_tmplvar_contentvalues"),"id = '{$tv['id']}'");
		}
	}
}			