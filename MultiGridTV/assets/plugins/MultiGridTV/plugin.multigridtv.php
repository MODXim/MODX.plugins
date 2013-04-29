//<?php 
/**
 * MultiGrid
 *
 * @category 	plugin
 * @version 	1.2
 * @license 	http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
 * @author		Jako (thomas.jakobi@partout.info)
 *              Based on a lot of code of Temus (temus3@gmail.com)
 *              Modifications by sam (sam@gmx-topmail.de)
 *
 * @internal    @description: <strong>1.2</strong> Transform template variables into a table/grid.
 * @internal    @plugin code: include(MODX_BASE_PATH.'assets/plugins/multigrid/MultiGrid.plugin.php');
 * @internal	@properties: &configs=Use Config Files:;list;yes,no;no &tvids=TV IDs:;text; &tpl=Template IDs:;text; &roles=Roles:;text; &columnNames=Column Names:;text;key,value
 * @internal	@events: OnDocFormRender
 */
 
if (IN_MANAGER_MODE != 'true') {
    die('<h1>ERROR:</h1><p>Please use the MODx Content Manager instead of accessing this file directly.</p>');
}
global $content,$default_template;

// retrieve plugin settings
$pluginPath = isset($pluginPath) ? trim($pluginPath, '/').'/' : 'assets/plugins/multigrid/';
$configs = ($configs == 'yes') ? true : false;

$gridConfigs = array();
if (isset($tvids)) {
    $gridConfigs[0]['tvids'] = isset($tvids) ? $tvids : '';
    $gridConfigs[0]['tplids'] = isset($tpl) ? $tpl : false;
    $gridConfigs[0]['roles'] = isset($role) ? $role : false;
    $gridConfigs[0]['columnNames'] = isset($columnNames) ? $columnNames : 'key,value';
}
if ($configs) {
    $configFiles = glob(MODX_BASE_PATH.$pluginPath.'configs/*.config.inc.php');
    foreach ($configFiles as $configFile) {
        $settings = array();
        include $configFile;
        if (isset($settings['tvids'])) {
            $settings['tvids'] = $settings['tvids'];
            $settings['tplids'] = isset($settings['tplids']) ? trim($settings['tplids']) : false;
            $settings['roles'] = isset($settings['roles']) ? trim($settings['roles']) : false;
            $settings['columnNames'] = isset($settings['columnNames']) ? trim($settings['columnNames']) : "key,value";
            $gridConfigs[] = $settings;
        }
    }
}

// exit if no configs are set
if (!count($gridConfigs))
    return;
    
if (!class_exists('gridChunkie')) {
    include (MODX_BASE_PATH.$pluginPath.'includes/chunkie.class.inc.php');
}

$curTpl = isset($_POST['template']) ? $_POST['template'] : isset($content['template']) ? $content['template'] : $default_template;
$curRole = $_SESSION['mgrRole'];
$tvids = $columnNames = $columnTitles = $templateVarsIds = array();

// populate javascript variables with tvids and columnNames
foreach ($gridConfigs as $gridConfig) {
    $tvids = explode(",", $gridConfig['tvids']);
    $roles = ($gridConfig['roles']) ? explode(",", $gridConfig['roles']) : false;
    $tplids = ($gridConfig['tplids']) ? explode(",", $gridConfig['tplids']) : false;
    $columns = explode(',', $gridConfig['columnNames']);
    $columnCount = count($columns);
    
    // if the current template has not to be processed or the manager user is not allowed to use the plugin
    if (($tplids && !in_array($curTpl, $tplids)) || ($roles && !in_array($curRole, $roles))) {
        continue;
    }
    
    foreach ($tvids as $tvid) {
        $templateVarsIds[] = "'tv".$tvid."'";
        $columnName = array();
        foreach ($columns as $i=>$column) {
            $columnName[$i] = trim($column);
        }
        $columnNames[] = "new Array('".implode("','", $columnName)."')";
    }
}

// parse the javascript and css chunks
$templateVarsIds = 'new Array('.implode(',', $templateVarsIds).')';
$columnNames = 'new Array('.implode(',', $columnNames).')';

$script = '<style type="text/css">'."\r\n";
$parser = new gridChunkie('@FILE:'.$pluginPath.'MultiGrid.template.css');
$script .= $parser->Render();
$script .= '</style>'."\r\n";

$script .= '<script type="text/javascript">'."\r\n";
$parser = new gridChunkie('@FILE:'.$pluginPath.'MultiGrid.template.js');
$parser->AddVar('tvids', $templateVarsIds);
$parser->AddVar('columnNames', $columnNames);

$script .= $parser->Render();
$script .= '</script>'."\r\n";

$e = &$modx->Event;
if ($e->name == 'OnDocFormRender') {
    $output = $script;
    $e->output($output);
}

?>
