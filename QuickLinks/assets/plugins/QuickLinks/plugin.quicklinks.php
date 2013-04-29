//<?php
/**
 * QuickLinks
 *
 * Create quick edit links in main page of manager panel
 *
 * @category    plugin
 * @version     0.35
 * @license     http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
 * @author      Dmi3yy, a-sharapov
 * @internal    @properties &dcids=ID документов для формирования списка (запись вида Редактировать:2,3||Добавить:5);string;
 * @internal    @events OnManagerWelcomePrerender
 */

if (!defined('MODX_BASE_PATH')) {
        die('What are you doing? Get out of here!');
}

global $modx;
$groups = explode("||", $dcids);
$result = "";

$e = &$modx->Event;
if($e->name == 'OnManagerWelcomePrerender') {

if($dcids) {
$result .= '
<div class="sectionHeader">Быстрое администрирование</div>
<div class="sectionBody"><table><tbody><tr>';

// Get quick edit resource tree
        foreach ($groups as $key => $value) {
                $result .= '<td style="vertical-align: top">';
                $titleplsitems = explode(':', $value);
                $result .= '<h4>'.$titleplsitems[0].':</h4>';

                switch($titleplsitems[0])
                {
                        case "Добавить":
                                        $method = '4&pid=';
                                        $type = 'doc';
                                        $trigger = '0';
                                        break;
                        case "Редактировать":
                                        $method = '27&id=';
                                        $type = 'doc';
                                        $trigger = '1';
                                        break;
                        case "Модули":
                                        $type = 'module';
                                        $trigger = '0';
                                        break;
                        case "Чанки":
                                        $type = 'chunk';
                                        $trigger = '0';
                                        break;
                }

                $items = explode(',', $titleplsitems[1]);
                $result .= '<ul>';
                foreach ($items as $key => $value) {
                        switch($type)
                        {
                                case "doc":
                                        if ( $value == '0') {
                                                $name = '<b>Новую страницу</b>';
                                        } else {
                                                $docInfo = $modx->getDocument($value);
                                                $name = $docInfo["pagetitle"];
                                        }
                                        break;
                                case "module":
                                        if ( $value == '0') {
                                                $name = '<b>Новый модуль</b>';
                                                $value = '';
                                                $method = '107';
                                        } else {
                                                $method = '112&id=';
                                                $table = $modx->getFullTableName('site_modules');
                                                $query = $modx->db->query("SELECT * FROM $table WHERE id = $value");
                                                while( $row = $modx->db->getRow( $query ) ) {
                                                        $name = $row['name'];
                                                }
                                        }
                                        break;
                                case "chunk":
                                        if ( $value == '0') {
                                                $name = '<b>Новый чанк</b>';
                                                $value = '';
                                                $method = '77';
                                        } else {
                                                $method = '78&id=';
                                                $table = $modx->getFullTableName('site_htmlsnippets');
                                                $query = $modx->db->query("SELECT * FROM $table WHERE id = $value");
                                                while( $row = $modx->db->getRow( $query ) ) {
                                                        $name = $row['name'];
                                                }
                                        }
                                        break;
                        }
                        if ( $trigger == '1' && $value == '0' ) {
                                $result .= '';
                        } else {
                                $result .= '<li><a href="index.php?a='.$method.$value.'">'.$name.'</a></li>';
                        }
                }
                $result .= '</ul></td>';
        }
$result .= '</tr></tbody></table></div>';
}

// Print result
$e->output($result);
}
