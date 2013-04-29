//<?php
/**
 * ACE
 * 
 * Add a rich text editor ACE for MODX Evo.
 * @author	 Ryota Mannari <info@manse.jp>
 * @events OnChunkFormRender, OnDocFormRender, OnModFormRender, OnSnipFormRender, OnTempFormRender, OnPluginFormRender, OnRichTextEditorRegister
 * @modx_category Manager and Admin
 **/

global $modx, $content;
$plugin_base = 'assets/plugins/ACE/';

$e = $modx->event;

if ($e->name === 'OnRichTextEditorRegister') {
	$e->output('ACE');
} elseif (is_file(MODX_BASE_PATH . $plugin_base . 'plugin.js')) {
	$e->output('<!-- ACE Plugin -->' . "\n");
	$prte = (isset($_POST['which_editor']) ? $_POST['which_editor'] : false);
	$srte = ($modx->config['which_editor'] ? $modx->config['which_editor'] : false);
	
	switch ($e->name) {
		case 'OnTempFormRender':
			$lang = 'html';
			$rte = $srte;
			break;
	
		case 'OnChunkFormRender':
			$lang = 'html';
			$rte = $prte !== false ? $prte : $srte;
			break;
	
		case 'OnDocFormRender':
			$lang = $content['contentType'];
			$lang = end(explode('/', $lang));
			switch($lang) {
				case 'html':
				case 'css':
				case 'javascript':
				case 'xml':
					break;
	
				case 'plain':
					$lang = 'text';
					break;
				
				default:
					$lang = 'html';
			}
			$rte = $prte !== false ? $prte : $srte;
			break;
	
		case 'OnSnipFormRender':
		case 'OnPluginFormRender':
		case 'OnModFormRender':
			$lang = 'php';
			$rte = $srte;
			break;
			
		default:
			$rte = '';
			$lang = 'html';
	}
	
	if ($rte === 'ACE') {
		$e->output('<link rel="stylesheet" type="text/css" href="../' . $plugin_base . 'style.css" />' . "\n");
		$e->output('<script type="text/javascript" src="../' . $plugin_base . 'src-min/ace.js"></script>' . "\n");
		$e->output('<script type="text/javascript">' . "\n");
		$e->output('(function() {' . "\n");
		$e->output('var uilang = "' . addslashes($modx->config['manager_language']) . '";');
		$e->output('var ename = "' . $e->name . '";' . "\n");
		$e->output('var id = "' . intval($_GET['a']) . '_' . intval($_GET['id']) . '_";' . "\n");
		$e->output('var language = "' . $lang . '";' . "\n");
		$e->output(file_get_contents(MODX_BASE_PATH . $plugin_base . 'plugin.js'));
		$e->output('})();' . "\n");
		$e->output('</script>' . "\n");
	}
	$e->output('<!-- ACE Plugin -->' . "\n");
}