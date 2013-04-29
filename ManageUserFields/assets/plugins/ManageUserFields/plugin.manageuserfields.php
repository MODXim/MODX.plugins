//<?php
/*
 *
 * ManageUserFields
 * Плагин для скрытия и переименования полей веб-пользователей в админ-панели MODX Evo
 *
 * @category    plugin
 * @version     0.1
 * @author      Akool
 * @internal    @properties &hideFields=Скрываем;text; &renameFields=Переименовываем;
 * @internal    @events OnWUsrFormRender
 * @internal    @modx_category Manager and Admin
 *
 * Exemple config: &hideFields=Скрываем;text;phone,mobilephone,zip,country,dob,gender &renameFields=Переименовываем;textarea;state||Регион:,comment||Контакты:
 *
 */

function replaceName($var) {
  $out = '[name='.trim($var).']';
  return $out;
}

$hideFields = isset($hideFields) ? explode(',', $hideFields) : false;
$renameFields = isset($renameFields) ? explode(',', $renameFields) : false;
$output = '';
$hideFieldsSrt = '';
$renameFieldsSrt = '';

$e = &$modx->Event;
if ($e->name == 'OnWUsrFormRender') {

  if (is_array($hideFields) && count($hideFields)>0) {
    $hideFieldsArr = array_map('replaceName', $hideFields);
    $hideFieldsSrt = "$$('".implode(', ', $hideFieldsArr)."').getParent().getParent().empty()";
  }

  if (is_array($renameFields) && count($renameFields)>0) {
    foreach ($renameFields as $field){
      $val = explode('||',$field);
      $renameRow .= "$$('[name=".$val[0]."]').getParent().getParent().addClass('".$val[0]."');
                    \$E('.".$val[0]." td').setText('".$val[1]."');"
        ;
    }
    $renameFieldsSrt = $renameRow;
  }

  if ('' != $hideFieldsSrt || '' != $renameFieldsSrt) {
    $output = "
<!-- ManageUserFields plugin -->
<script type=\"text/javascript\">
window.addEvent('domready', function() {
".$hideFieldsSrt."
".$renameFieldsSrt."
});
</script>";
  }
}
$e->output($output);
