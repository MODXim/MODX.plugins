//<?php
/**
 *
 *
 * @category   plugin
 * @version    0.1
 * @license    GNU General Public License (GPL), http://www.gnu.org/copyleft/gpl.html
 * @internal    @properties &limit=ログの上限数;int;1000 &trim=一度に削除する件数;int;100
 * @internal   @events OnManagerLogin
 * @internal   @modx_category Manager and Admin
 * @author     yama (http://kyms.jp)
 */


$tbl_manager_log = $modx->getFullTableName('manager_log');
$sql = 'SELECT COUNT(id) FROM ' . $tbl_manager_log;
$rs = $modx->db->query($sql);
if($rs) $row = mysql_fetch_row($rs);
$over = $row[0] - $limit;
if($over > 0)
{
     $sql = 'DELETE FROM ' . $tbl_manager_log . ' LIMIT ' . ($over + $trim);
     $modx->db->query($sql);
     $sql = 'OPTIMIZE TABLE ' . $tbl_manager_log;
     $modx->db->query($sql);
}

$tbl_event_log = $modx->getFullTableName('event_log');
$sql = 'SELECT COUNT(id) FROM ' . $tbl_event_log;
$rs = $modx->db->query($sql);
if($rs) $row = mysql_fetch_row($rs);
$over = $row[0] - $limit;
if($over > 0)
{
     $sql = 'DELETE FROM ' . $tbl_event_log . ' LIMIT ' . ($over + $trim);
     $modx->db->query($sql);
     $sql = 'OPTIMIZE TABLE ' . $tbl_event_log;
     $modx->db->query($sql);
}
