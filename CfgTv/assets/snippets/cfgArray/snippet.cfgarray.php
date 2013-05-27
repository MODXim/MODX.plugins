<?php
/**
 * cfgArray
 * Для работы этого сниппета необходим плагин cfgTV версии 0.2 с возможностью сохранять сериализованные массивы ТВшек в конфиг 
 *
 * @category  parser
 * @version   0.2
 * @license     GNU General Public License (GPL), http://www.gnu.org/copyleft/gpl.html
 * @author Agel_Nash <Agel_Nash@xaker.ru>
 */
$cfg = (!empty($name) && is_scalar($name) && isset($modx->config[$name])) ? unserialize($modx->config[$name]) : array();
$out = '';
if(is_array($cfg)){
	$return = (isset($return)) ? explode(',',$return) : array();
	$tmp = array();
	if(array()==$return){
		$tmp = $cfg;
	}else{
		foreach($cfg as $id=>$item){
			if($id==$return){
				$tmp[]=$item;
			}
		}
	}
	$sep = (isset($sep) && is_scalar($sep) ? $sep : ',');
	$out = implode($sep,$tmp);
}else{
	$out = '';
}
return $out;
?>