<?php 
/**
 * MultiGrid
 * @category 	snippet
 * @version 	1.2
 * @license 	http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
 * @author		Jako (thomas.jakobi@partout.info)
 *              Modifications by sam (sam@gmx-topmail.de)
 *
 * @internal    @description: <strong>1.2</strong> Transform template variables into a table/grid.
 * @internal    @snippet code: return include(MODX_BASE_PATH.'assets/plugins/multigrid/MultiGrid.snippet.php');
 */
 
if (MODX_BASE_PATH == '') {
    die('<h1>ERROR:</h1><p>Please use do not access this file directly.</p>');
}

// snippet parameter
$tvName = isset($tvName) ? $tvName : '';
$docid = isset($docid) ? $docid : $modx->documentObject['id'];
$columnNames = isset($columnNames) ? $columnNames : 'key,value';
$outerTpl = isset($outerTpl) ? $outerTpl : '@CODE:<select name="'.$tvName.'">[+wrapper+]</select>';
$rowTpl = isset($rowTpl) ? $rowTpl : '@CODE:<option value="[+value+]">[+key+]</option>';
$pluginPath = isset($pluginPath) ? trim($pluginPath, '/').'/' : 'assets/plugins/multigrid/';
$config = isset($config) ? $config : '';

// snippet code
if ($config != '') {
    $settings = array();
    include (MODX_BASE_PATH.$pluginPath."configs/".trim($config).'.config.inc.php');
    $columnNames = (isset($settings['columnNames']) && $settings['columnNames'] != '') ? $settings['columnNames'] : $columnNames;
}
$maskedTags = array('(('=>'[+', '))'=>'+]', '{+'=>'[+', '+}'=>'+]');
$outerTpl = str_replace(array_keys($maskedTags), array_values($maskedTags), $outerTpl);
$rowTpl = str_replace(array_keys($maskedTags), array_values($maskedTags), $rowTpl);

$columns = explode(',', $columnNames);
$columnCount = count($columns);
$tvOutput = $modx->getTemplateVarOutput(array($tvName), $docid);
$tvOutput = $tvOutput[$tvName];
$tvOutput = json_decode($tvOutput);

// stop if there is no output
if (!count($tvOutput))
    return;
    
// parse the output chunks
if (!class_exists('gridChunkie')) {
    include (MODX_BASE_PATH.$pluginPath.'/includes/chunkie.class.inc.php');
}

$wrapper = '';
foreach ($tvOutput as $num => $value) {
    $parser = new gridChunkie($rowTpl);
    for ($i = 0; $i < $columnCount; $i++) {
        $parser->AddVar($columns[$i], $value[$i]);
    }
    $parser->AddVar('num', $num);
    $wrapper .= $parser->Render();
}

$parser = new gridChunkie($outerTpl);
$parser->AddVar('wrapper', $wrapper);
$output = $parser->Render();
return $output;
?>
