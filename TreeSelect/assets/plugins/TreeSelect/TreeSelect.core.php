<?php defined('IN_MANAGER_MODE') or die('<h1>ERROR:</h1><p>Please use the MODx Content Manager instead of accessing this file directly.</p>');

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
//  Core part of the
//  TreeSelectTV
//  for MODx Evolution CMF
//
//  @version    0.2.1
//  @license    http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
//  @author     sam (sam@gmx-topmail.de)
//  @www        https://github.com/Sammyboy/TreeSelectTV-plugin
//
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

global $content,$default_template,$tmplvars;

// Include other parts of the package:
// Classes
include $pluginPath."TreeSelect.class.php";
include $pluginPath."PluginConfig.class.php";

// Config files
$settings = $options = array();

// load default configuration from file
$default_config = $pluginPath."configs/default.config.inc.php";
include $default_config;

// … and from the backend plugin configuration
$plugin = new PluginConfig('TreeSelectTV');
$plugin->deleteOption('pluginPath');
$default_settings = array_merge($settings, $plugin->config['values']);

// load custom configuration files
$configFiles = glob($pluginPath.'configs/*.config.inc.php');

if (count($configFiles)) {
    foreach ($configFiles as $i => $configFile) {
        $settings = $default_settings;
        if ($configFile != $default_config) include $configFile;
        if ( !isset($settings['input_tvids']) ||
             (is_string($settings['input_tvids']) && 
             !strlen($settings['input_tvids']))
           ) continue;
        $options[$i] = $plugin->config;
        $options[$i]['values'] = $settings;
        $options[$i]['file'] = $configFile;
        unset($settings);
    }
} elseif (!isset($default_settings['input_tvids']) || (is_string($default_settings['input_tvids']) && !strlen($default_settings['input_tvids']))) return;
else {
    $options[0] = $plugin->config;
    $options[0]['values'] = $default_settings;
    $options[0]['file'] = $default_config;
}

// Initialize things
$tvIds = $htmlTrees = $inputStatus = $basePaths = $saveConfigs = $json_opts = "";

$cur_tpl    = isset($_POST['template']) ? $_POST['template'] : (isset($content['template']) ? $content['template'] : $default_template);
$cur_role   = $_SESSION['mgrRole'];

// exit on blank template
if ($cur_tpl == 0) return;

// Set options for each TV
foreach ($options as $i => $option) {
    $option['values']['list_path_base'] = strtolower($option['values']['list_path_base']);
    $opt = $option['values'];
    $sep = $opt['list_separator'];
    if (($opt['list_depth'] !== false) && ($opt['list_depth'] > -1)) $opt['list_depth'] += 1;
    
    // Check if the current template matches and user has the right role
    $tpl    = (strlen($opt['input_tplids'])) ? explode(',', $opt['input_tplids']) : false;
    $role   = (strlen($opt['input_roles'])) ? explode(',', $opt['input_roles']) : false;
    if (($tpl && !in_array($cur_tpl, $tpl)) || ($role && !in_array($cur_role, $role))) continue;
    
    if ($opt['list_folders__base'] == "") $opt['list_folders__base'] = MODX_BASE_PATH;
    $tvName = (isset($option['file']) && $option['file']) ? basename($option['file']) : "default";
    $tvName = strlen($tvName) ? substr($tvName, 0, strpos($tvName, '.')) : "";

    $tvIds          .=  (strlen($tvIds) ? "," : "")."[".trim($opt['input_tvids'])."]";
    $inputStatus    .=  (strlen($inputStatus) ? "," : "").
                        (strlen($opt['input_status']) && in_array($opt['input_status'], array("show","toggle")) ?
                        "'".trim($opt['input_status'])."'" :"''");
    $basePaths      .=  (strlen($basePaths) ? "," : "")."'".
                        ((isset($opt['list_path_base']) && ($opt['list_path_base'] != "start folder")) ?
                            (($opt['list_path_base'] == "server root") ?
                                $sep.trim(trim($opt['list_folders__base'],$sep).$sep.trim($opt['list_folders__start'],$sep)).$sep :
                                trim($opt['list_folders__start'],"/")."/") : 
                            ""
                        )."'";
    $saveConfigs    .=  (strlen($saveConfigs) ? "," : "")."[".
                        ($cur_role == 1 ? ($tvName == "default" ? "'{$tvName}','save'" : "'{$tvName}','reset','delete'" ) : "''")."]";
    unset($option['values']['list_outerTpl']);
    unset($option['values']['list_innerTpl']);
    $json_opts      .=  (strlen($json_opts) ? "," : "").json_encode($option);

    // Generate directory listing
    $TreeSelect = new TreeSelect($opt);

    if (is_array($TreeSelect->treeList) && count($TreeSelect->treeList)) {
        
        // ... and put it into HTML code
        $html_tree = $TreeSelect->list2HTML();
        $htmlTrees .= strlen($html_tree) ? (strlen($htmlTrees) ? "," : "")."'".$html_tree."'" : "";
    }
    unset($TreeSelect);
}
if (!strlen($htmlTrees)) return;

$e = &$modx->Event;
if ($e->name == 'OnDocFormRender') {

    $modx_script = renderFormElement('text',0,'','','');
    preg_match('/(<script[^>]*?>.*?<\/script>)/si', $modx_script, $matches);
    $output = $matches[0];
    $rel_pluginPath = "../".str_replace(MODX_BASE_PATH, '', $pluginPath);
    // Include our JS and CSS file and modify output
    $output .= <<< OUTPUT

<!-- TreeSelect -->
<link rel="stylesheet" type="text/css" href="{$rel_pluginPath}TreeSelect.styles.css" />
<script type="text/javascript" src="{$rel_pluginPath}TreeSelect.class.js"></script>
<script type="text/javascript">
window.addEvent('domready', function() {
    var tvIds           = new Array({$tvIds});
    var trees           = new Array({$htmlTrees});
    var inputStatus     = new Array({$inputStatus});
    var basePath        = new Array({$basePaths});
    var saveConfigs     = new Array({$saveConfigs});
    var configs         = new Array({$json_opts});

    for (var i=0; i<tvIds.length; i++) {
        for (var j=0; j<tvIds[i].length; ++j) {
            if ($('tv'+tvIds[i][j]) != null) { 
                new TreeSelect(tvIds[i][j],trees[i],inputStatus[i],basePath[i],saveConfigs[i],configs[i]);
            }
        }
    }   
});
</script>
<!-- /TreeSelect -->

OUTPUT;

    // ... and render it
    $e->output($output);
    
}


if ($e->name == 'OnBeforeDocFormSave') {
    $tvIds = explode(",", str_replace(array("[","]"), "", $tvIds));
    $tvIds = array_unique($tvIds);
    $config_ids = $plugin->config['values']['input_tvids'];
    $config_ids = strlen($config_ids) ? explode(",", $config_ids) : array();
    
    foreach ($tvIds as $tvId) {
        list($path, $save_opt, $settings)  = json_decode($tmplvars[$tvId][1]);
        if (isset($save_opt) && strlen($save_opt)) {
            list($prefix, $opt) = explode(":", $save_opt);
            $file_path = $pluginPath."configs/".$prefix.".config.inc.php";

            if (file_exists($file_path)) unlink($file_path);
            if ($opt == "delete") {
                // Add deleted IDs to the properties string
                if (!in_array($tvId, $config_ids))
                    $config_ids[count($config_ids)] = $tvId;

            } else {
                // Write configuration file
                $output = <<< OUTPUT
<?php defined('IN_MANAGER_MODE') or die('<h1>ERROR:</h1><p>Please use the MODx Content Manager instead of accessing this file directly.</p>');

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
//  Configuration file for the
//  TreeSelectTV for MODx Evolution
//
//  @version    {$plugin->pluginInfo['version']}
//
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


OUTPUT;
                foreach ($settings as $key => $value) {
                    $output .=  "\$settings['{$key}'] = ".
                                (($plugin->config['type'][$key] == "int") ? $value : (is_bool($value) ? ($value ? "true" : "false") : "\"{$value}\"")).
                                ";\n";
                }
                $output .= "\n?>";
                if (file_put_contents($file_path, $output) === false) print_r("ERROR: Could not write \"{$path}\"");
                else {
                    // Delete IDs from properties string
                    if (is_array($config_ids) && count($config_ids)) {
                        for ($i = 0; $i<count($config_ids); $i++) {
                            if ($config_ids[$i] == $tvId) unset($config_ids[$i]);
                        }
                    }
                }
            }
        }
        $tmplvars[$tvId][1] = $path;
    }

    if (isset($config_ids) && count($config_ids))
        $config_ids = trim(implode(",", $config_ids), ",");
    else $config_ids = "";

    if ($config_ids != $plugin->config['values']['input_tvids']) {
        $plugin->config['values']['input_tvids'] = $config_ids;
        $config_str = "&pluginPath=Plugin path;string;".str_replace(MODX_BASE_PATH, "", $pluginPath)." ";
        $config_str .= $plugin->setConfigString();
        if (!$plugin->saveProperties($config_str))
            print_r("ERROR: Could not save TreeSelectTV plugin properties to the database <br>");
    }
}
?>
