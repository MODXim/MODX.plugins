<?php //<?php
/**
 * ModernLogin
 * 
 * Fix the login window for MODX Evo.
 * @author	 Ryota Mannari <info@manse.jp>
 * @events OnManagerLoginFormRender
 * @modx_category Manager and Admin
 **/

global $modx, $content;
$plugin_base = 'assets/plugins/modernlogin/';
if ($modx->event->name === 'OnManagerLoginFormRender' && is_file(MODX_BASE_PATH . $plugin_base . 'template.html')) {
	$modx->setPlaceholder('ml_year', date('Y'));
	$modx->setPlaceholder('ml_http_path', $modx->config['base_url'] . $plugin_base);
	$tpl = file_get_contents(MODX_BASE_PATH . $plugin_base . 'template.html');
	$tpl = $modx->mergePlaceholderContent($tpl);
	$regx = strpos($tpl,'[[+') !== false ? '~\[\[\+(.*?)\]\]~' : '~\[\+(.*?)\+\]~';
	$tpl = preg_replace($regx, '', $tpl);
	echo $tpl;
	exit;
}?>