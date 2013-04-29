//<?
/*
     @see: https://gist.github.com/mrogalsky/1467200
     Sape.RU Context Plugin for MODx Evolution
*/

if (!defined('_SAPE_USER')){
        define('_SAPE_USER', ' _USER_FOLDER_ ');
}
require_once($_SERVER['DOCUMENT_ROOT'].'/'._SAPE_USER.'/sape.php');
$sape_context = new SAPE_context();

$e = &$modx->Event;

switch($e->name) {
  case 'OnLoadWebDocument':
    $content = $modx->documentObject['content'];
    $content = $sape_context->replace_in_text_segment($content);
    $modx->documentObject['content'] = $content;
    break;

  default:
    return;
    break;
}
