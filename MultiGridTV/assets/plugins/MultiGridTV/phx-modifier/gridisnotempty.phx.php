<?php
/*  
 * description: check whether the grid tv is not empty
 * usage: [+phx:gridisnotempty=`tvname|docid`:then=``:else=`+]
 * tvname = name of the grid tv
 * docid = id of the document with the grid tv to use i.e. in ditto (defaults to current document)
 */

$options = explode('|', $options);
$options[1] = isset($options[1]) ? $options[1] : $modx->documentIdentifier;
$tvOutput = $modx->getTemplateVarOutput(array($options[0]), $options[1]);
$tvOutput = trim($tvOutput[$options[0]]);
$condition[] = intval($tvOutput != '[]' && $tvOutput != '');
?>
