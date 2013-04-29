//<?php
/**
 ** cleanEmptyBlock plugin for MODX Evo
 ** @Author: alooze (a.looze@gmail.com)
 ** @Version: 0.2POC
 ** @Date: 23.02.2013
 ** @Event: OnWebPagePrerender
 **/

$e = $modx->event;

switch ($e->name) {
  case 'OnWebPagePrerender':
    $content = $modx->documentOutput;

    $replace= array ();
    $matches= array ();
    //находим конструкции вида
    //[? _какой-то HTML код ~~[+ph+]~~ с плейсхолдером или ~~[!snip!]~~ сниппетом_ ?]
    if (preg_match_all('~\[\?(.*?)\?\]~ms', $content, $matches)) {
      $checkCnt = count($matches[1]);
      for ($i= 0; $i < $checkCnt; $i++) {
        if (strpos($matches[1][$i], '~~~~')) {
          //плейсхолдер или сниппет отдали пустое значение, блок не выводим
          $replace[$i] = '';
        } else {
          //между ~~ ~~ есть хотя бы пробел, этого достаточно, чтобы показать весь блок
          $replace[$i] = str_replace('~~', '', $matches[1][$i]);
        }
      }

      $modx->documentOutput = str_replace($matches[0], $replace, $content);
    }
  break;
}
