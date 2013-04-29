//<?php
/**
 * dIE [detector IE]
 *
 * Out message for IE customizable with chunk
 *
 * @category    plugin
 * @version     0.3
 * @license     http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
 * @author      a-sharapov
 * @internal    @properties &iever=Минимальная версия браузера для блокировки;int;&tpl=Имя чанка для шаблонизации(чувствительно к регистру);string;&page=ID страницы для редиректа;int;
 * @internal    @events OnParseDocument
 */

$iever = (isset($iever)) ? $iever : '6';
$tpl = (isset($tpl)) ? $tpl : '';
$page = (isset($page)) ? $page : '';

include_once $this->config["base_path"] . "manager/includes/extenders/getUserData.extender.php";

$e = &$modx->Event;
if ($e->name == 'OnParseDocument') {

        $o = $modx->documentOutput;
        $user = $modx->getUserData();

        if ($user['browser'] == 'ie' && $user['maj_ver'] <= $iever && $modx->documentIdentifier != $page) {
                if ($tpl != '') {
                        $o = $modx->getChunk($tpl);
                        $modx->documentOutput = $o;
                } else {
                        $o = '<!DOCTYPE html><html><head><title>503 Service Temporarily Unavailable</title></head><body><h1>Сервис недоступен для вашей версии браузера</h1><p>Данный сайт использует современные технологии и не пригоден для просмотра в старых версиях браузеров</p></body></html>';
                        /* OUT */
                        if ($page != '' ) {
                                $modx->sendRedirect($modx->makeUrl($page));
                        } else {
                                header('HTTP/1.1 503 Service Unavailable');
                                $modx->documentOutput = $o;
                        }
                }
        }
}
