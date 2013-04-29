//<?php
/**************************************/
/** HtmlInLine plugin for MODX Revo
*
* @version 1.1
* @author Borisov Evgeniy aka Agel Nash (agel-nash@xaker.ru)
*
* @category plugin
* @internal @event OnWebPagePrerender
* @internal @modx_category HTML-code
*
*/
/*************************************/
$e =&$modx->event;
switch ($e->name) {
    case "OnWebPagePrerender":{
        if($modx->documentObject['searchable']==1){
            $content = $modx->documentOutput;
            $content= preg_replace('|\s+|', ' ', $content);
            $modx->documentOutput = $content;
        }
        break;
    }
}
