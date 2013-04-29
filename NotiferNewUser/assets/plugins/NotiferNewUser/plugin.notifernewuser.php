//<?php
/**
* NotiferNewUser
*
* Уведомление о новой регистрации на сайте.
*
* @category     plugin
* @version      0.2
* @license      http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
* @internal     @properties &toEmail=Почта получателя;text; &subject=Тема письма;text;
* @internal     @events OnWebSaveUser
* @internal     @modx_category Manager and Admin
* @author Akool
*/

$notifyTpl = '
<p>Новая регистрация на сайте [+site_name+].</p>
<p>Пользователь с электронной почтой [+useremail+].</p>';

$toEmail = isset($toEmail) ? $toEmail : $modx->config['emailsender']; // получаетль уведомления
$subject = isset($subject) ? $subject : 'Новая регистрация на сайте'; // тема письма


if ($modx->Event->name == 'OnWebSaveUser') {

  $uemail = isset($useremail) ? $useremail : ($_POST['email'] != '' ? $modx->db->escape($modx->stripTags($_POST['email'])) : '');

  if ($mode != 'new' || $uemail == '' || !filter_var($uemail, FILTER_VALIDATE_EMAIL)) return;

  require_once 'manager/includes/controls/class.phpmailer.php';

  $notification = str_replace('[+useremail+]', $uemail, $notifyTpl);
  $notification = str_replace('[+site_name+]', $modx->config['site_name'], $notification);

  $Notify = new PHPMailer();
  $Notify->CharSet = $modx->config['modx_charset'];
  $Notify->IsHTML(true);
  $Notify->From = $modx->config['emailsender'];
  $Notify->FromName = $modx->config['site_name'];
  $Notify->Subject = $subject;
  $Notify->Body = $notification;
  $Notify->AddAddress($toEmail);
  if (!$Notify->Send()) {
    $modx->logEvent(89, 1, 'Не удалось отправить письмо на адрес '.$toEmail.' о новом пользователе.', 'NotiferNewUser');
    return;
  }
}
