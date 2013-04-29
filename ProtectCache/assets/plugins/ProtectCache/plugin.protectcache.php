//<?
/**
 * ProtectCache created By Agel_Nash
 *
 * @category    plugin
 * @version     v 1.0
 * @internal    @events OnWebPageInit
 * @internal  @properties  &getkey=GET ключи;textarea;q,id
 */
if ($modx->Event->name == 'OnWebPageInit'){
  $getkey=isset($getkey) ? explode(",",$getkey) : (($this->config['friendly_urls'] == 1) ? array('q') : array('id'));
  $key=array_keys($_GET);
  foreach($key as $k){
    if(!in_array($k,$getkey)){
      $modx->sendRedirect($modx->makeUrl($modx->documentIdentifier));
    }
  }
}