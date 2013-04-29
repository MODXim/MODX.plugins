//<?php
/**
 * Unlock
 *
 * Unlock
 *
 * @category   plugin
 * @version    0.2
 * @license    http://www.opensource.org/licenses/gpl-2.0.php GNU Public License Version 2 (GPL2)
 * @internal   @events OnManagerAuthentication,OnCacheUpdate
 * @internal   @modx_category Manager and Admin
 */

$limit_time = time() - 60 * 60 * 3;
$sql = 'DELETE FROM '. $modx->getFullTableName('active_users')
          . ' WHERE action=27 and lasthit < ' . $limit_time;
$modx->db->query($sql);
