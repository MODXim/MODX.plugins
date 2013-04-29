//<?php
/**
 * Protect TV-saver
 *
 * @category  plugin
 * @version   0.1
 * @license   GNU General Public License (GPL), http://www.gnu.org/copyleft/gpl.html
 * @internal   @events  OnBeforeDocFormSave
 * @internal   @modx_category Manager and Admin
 * @author Agel_Nash <Agel_Nash@xaker.ru>
 */

if($modx->Event->name=='OnBeforeDocFormSave'){
  if(!function_exists('checkValTV')){
    function checkValTV($value){
      $flag=false;
     if(substr(trim($value),0,1)=='@'){
          $val=explode(" ",trim($value),2);
          $flag=(in_array($val[0],array('@FILE','@CHUNK','@DOCUMENT','@SELECT','@EVAL','@INHERIT','@DIRECTORY'))) ? $value : false;
          }
      return $flag;
     }
  }

     foreach($_POST as $key=>$value){
          if (substr($key,0,2)=='tv'){
      if(is_array($value)){
        foreach($value as $item){
          if($flag=checkValTV($item)){
               break;
          }
        }
      }else{
          $flag=checkValTV($value);
      }

      if($flag){
        $modx->logEvent(666,2,"<strong>TV value:</strong> <pre>".var_export($value,true)."</pre>","HACK with @-TV ");
          die('HACK?');
      }
    }
  }
}
