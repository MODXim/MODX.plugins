//<?php
/**
 * Init value
 * Plugin Шаблонны при создании новых сниппетов/плагинов/модулей
 * @category   plugin
 */
$value = new init_value();
$e = &$modx->Event;
switch ($e->name)
{
  case 'OnPluginFormPrerender':
          if(isset($_GET['id'])) return;
          global $content;
          $content['plugincode'] = $value->plugin();
          break;
     case 'OnSnipFormPrerender':
          if(isset($_GET['id'])) return;
          global $content;
          $content['snippet'] = $value->snippet();
          break;
     case 'OnModFormPrerender':
          if(isset($_GET['id'])) return;
          global $content;
          $content['modulecode'] = $value->module();
          break;
     default:
          return; // stop here - this is very important.
          break;
}

class init_value
{
     function plugin()
     {
          $code = <<< EOT
//<?php
/**
 * Plugin name
 *
 * Plugin desc
 *
 * @category   plugin
 * @version    0.1
 * @license    http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
 * @internal   @properties &param=Param;text;hoge
 * @internal   @events
 * @internal   @modx_category
 *
 * @author xxxxx
 */
// Handle event
\$e = &\$modx->Event;
switch (\$e->name)
{
  case 'Onxxxxx': // register only for backend
    break;
  default:
    return; // stop here - this is very important.
    break;
}
EOT;
          return $code;
     }

     function snippet()
     {
          return 'return $value;';
     }

     function module()
     {
          $code = <<< EOT
global \$modx_lang_attribute,\$modx_textdir, \$manager_theme, \$modx_manager_charset;
global \$_lang, \$_style, \$e,\$SystemAlertMsgQueque,\$incPath,\$content;
include(\$incPath . 'header.inc.php');
?>
<h1><?php echo \$content['name']?></h1>
<script type="text/javascript" src="media/script/tabpane.js"></script>
<div class="sectionHeader"><?php echo \$content['name'];?></div>
<div class="sectionBody" style="padding:10px 20px;">
<div class="tab-pane" id="modulePane">
     <script type="text/javascript">
     tpModule = new WebFXTabPane( document.getElementById( "modulePane"), false );
     </script>
     <div class="tab-page" id="tabModule1">
     <h2 class="tab">tab1</h2>
     <script type="text/javascript">tpModule.addTabPage( document.getElementById( "tabModule1" ) );</script>
     information : print_r(\$content);
     </div>
     <div class="tab-page" id="tabModule2">
     <h2 class="tab">tab2</h2>
     <script type="text/javascript">tpModule.addTabPage( document.getElementById( "tabModule2" ) );</script>
     </div>
</div>
</div>
<?php
include(\$incPath .'footer.inc.php');
EOT;
          return $code;
     }
}
/*
 * @version    0.1
 * @license    http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
 * @internal   @events OnPluginFormPrerender,OnSnipFormPrerender,OnModFormPrerender
 * @internal   @modx_category Manager and Admin
 * @internal   @properties
 * @author          yama
*/
