//<?php
/**
 * AddVersion
 *
 * Add postfix-version to CSS and JS files width edit date | Добавляет постфикс с версией к CSS и JS файлам с датой редактирования
 * Работает с локальными файлами на сервере
 *
 * @category    plugin
 * @version     0.2
 * @license     http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
 * @author      a-sharapov
 * @internal    @properties &noshow=Имена файлов, которые не должны включать постфикс;string;
 * @internal    @events OnWebPagePrerender
 */

$filehref = '';

$noshow = (isset($noshow)) ? $noshow : '';
$noshow = explode(",", $noshow);

$domain = $modx->config['site_url'];

$e = &$modx->Event;
if ($e->name == 'OnWebPagePrerender') {

        $o = $modx->documentOutput;

        function av_clear_name($in, $end) {
                preg_match('/\/([A-Za-z0-9-\.]+)(?=\.'.$end.')/i', $in, $out);
                $out = $out[1];
                return $out;
        }

        /* CSS */
        preg_match_all('/<link[^>]*text\/css[^>]*>/im', $o, $styles);
        $styles = $styles[0];

        foreach($styles as $style) {
                preg_match('/href="([^"]*)"/', $style, $filehref);
                if (isset($filehref)) {
                        if (preg_match('/\/assets/', $filehref[1]) == 1) {
                                if (preg_match('/http/', $filehref[1]) == 1) {
                                        $filehref = str_replace($domain, "", $filehref[1]);
                                } else {
                                        $filehref = substr($filehref[1], 1);
                                }
                        } else {
                                $filehref = $filehref[1];
                        }
                        $filehrefclear = av_clear_name($filehref, 'css');
                        if (file_exists($filehref) and !in_array($filehrefclear, $noshow)) {
                                $version = '?ver='.date("d-F-H-i",filemtime($filehref));
                                $o = str_replace($filehref,$filehref.$version,$o);
                        }
                }
        }

        /* JS */
        preg_match_all('/<script[^>]*text\/javascript[^>]*>/im', $o, $scripts);
        $scripts = $scripts[0];

        foreach($scripts as $script) {
                preg_match('/src="([^"]*)"/', $script, $filehref);
                if (isset($filehref)) {
                        if (preg_match('/\/assets/', $filehref[1]) == 1) {
                                if (preg_match('/http/', $filehref[1]) == 1) {
                                        $filehref = str_replace($domain, "", $filehref[1]);
                                } else {
                                        $filehref = substr($filehref[1], 1);
                                }
                        } else {
                                $filehref = $filehref[1];
                        }
                        $filehrefclear = av_clear_name($filehref, 'js');
                        if (file_exists($filehref) and !in_array($filehrefclear, $noshow)) {
                                $version = '?ver='.date("d-F-H-i",filemtime($filehref));
                                $o = str_replace($filehref,$filehref.$version,$o);
                        }
                }
        }

        /* OUT */
        $modx->documentOutput = $o;

}
