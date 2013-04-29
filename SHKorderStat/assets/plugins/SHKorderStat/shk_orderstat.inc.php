<?php

$stat_type = isset($_GET['stat']) ? $_GET['stat'] : 1;
$stat_time = isset($_GET['time']) ? $_GET['time'] : 1;

$stat_data = array();
$stat_text = '';

switch($stat_type){
  case 1:
	  $q_where = $stat_time == 1 ? "date + INTERVAL 30 DAY > NOW()" : "";
    //Всего
    $o_total = $modx->db->getRow($modx->db->query("SELECT COUNT(*) AS cnt, SUM(price) AS price FROM ".$modx->getFullTableName('manager_shopkeeper').($q_where ? ' WHERE '.$q_where : '')));
    //Выполнен
    $o_executed = $modx->db->getRow($modx->db->query("SELECT COUNT(*) AS cnt, SUM(price) AS price FROM ".$modx->getFullTableName('manager_shopkeeper')." WHERE `status` = '4'".($q_where ? ' AND '.$q_where : '')));
    //Отменен
    $o_cancelled = $modx->db->getRow($modx->db->query("SELECT COUNT(*) AS cnt, SUM(price) AS price FROM ".$modx->getFullTableName('manager_shopkeeper')." WHERE `status` = '5'".($q_where ? ' AND '.$q_where : '')));
    //Остальные
    $o_other = $o_total['cnt'] - ($o_cancelled['cnt'] + $o_executed['cnt']);
    
    $stat_data = array(
      array("Выполнено",($o_total['cnt']>0 ? round($o_executed['cnt'] / $o_total['cnt'],2) * 100 : 0),$o_executed['cnt']),
      array("Отменено",($o_total['cnt']>0 ? round($o_cancelled['cnt'] / $o_total['cnt'],2) * 100 : 0),$o_cancelled['cnt']),
      array("Другие",($o_total['cnt']>0 ? round($o_other / $o_total['cnt'],2) * 100 : 0),$o_other)
    );
    $stat_colors_q = $modx->db->getValue($modx->db->select("value",$modx->getFullTableName('manager_shopkeeper_config'),"setting = 'conf_colors'"));
    $stat_colors = explode('~',$stat_colors_q);
    $stat_text = '
      <br />
      Всего заказов: <b>'.$o_total['cnt'].'</b>, на сумму: <b>'.$o_total['price'].'</b>  руб.<br />
      Сумма выполненных заказов: <b>'.(isset($o_executed['price']) ? $o_executed['price'] : 0).'</b> руб.<br />
      Сумма отмененных заказов: <b>'.(isset($o_cancelled['price']) ? $o_cancelled['price'] : 0).'</b> руб.
    ';
	break;
  case 2:
    
  break;
}


?>

<script type="text/javascript" src="../assets/plugins/shk_orderstat/jquery-1.5.1.min.js"></script>
<script type="text/javascript" src="../assets/plugins/shk_orderstat/js/highcharts.js"></script>
<script type="text/javascript" src="../assets/plugins/shk_orderstat/js/modules/exporting.js"></script>
<script type="text/javascript">
		var chart;
		$(document).ready(function() {
      chart = new Highcharts.Chart({
				credits: {
          enabled: false
        },
        chart: {
					renderTo: 'container',
          shadow: false,
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false
				},
				title: {
					text: 'Статистика заказов'
				},
				tooltip: {
					formatter: function() {
						return '<b>'+ + this.y +'%</b>';
					}
				},
        legend: {
          labelFormatter: function() {
            return '<b>'+ + this.y +'%</b> ('+this.c+')';
          }
        },
				plotOptions: {
					pie: {
						allowPointSelect: true,
            showInLegend: true,
						cursor: 'pointer',
            <?php if(count($stat_colors)): ?>borderColor: '#888888',<?php endif; ?>
            size: '60%',
						dataLabels: {
							enabled: true,
							color: '#000000',
							connectorColor: '#000000',
							formatter: function() {
								return '<b>'+ this.point.name +'</b> ('+this.point.c+')';
							}
						}
					}
				},
			    series: [{
					type: 'pie',
					name: 'stat',
					data: [
                  <?php
                  foreach($stat_data as $key => $val):
                    echo "\n{name:'".$val[0]."',y:".$val[1].",c:".$val[2]."}".($key+1 < count($stat_data) ? ',' : '');
                  endforeach;
                  unset($key,$val);
                  ?>
        				]
				}]
        <?php if(count($stat_colors)): ?>,
        colors: [
            '<?php echo implode("','",array($stat_colors[3],$stat_colors[4],$stat_colors[0])); ?>'
        ]
        <?php endif; ?>
			});
      Highcharts.setOptions({
        lang: {
          downloadPNG: 'Скачать в формате PNG',
          downloadJPEG: 'Скачать в формате JPEG',
          downloadPDF: 'Скачать в формате PDF',
          downloadSVG: 'Скачать в формате SVG',
          exportButtonTitle: 'Экспорт',
          loading: 'Загрузка...',
          printButtonTitle: 'Печать'
        }
      });
		});
			
	</script>

<h1><?php echo $mod_name; ?></h1>

<form action="index.php" method="get">
  <input type="hidden" name="id" value="<?php echo $_GET['id']; ?>" />
  <input type="hidden" name="a" value="112" />
  <input type="hidden" name="action" value="plugin" />
  <input type="hidden" name="pname" value="orderstat" />
  <br />
  
  <select name="stat" onchange="document.forms[0].submit();">
    <option value="1" <?php if($stat_type==1) echo 'selected="selected"'; ?>>статистика заказов</option>
  </select>
  
  <select name="time" onchange="document.forms[0].submit();">
    <option value="1" <?php if($stat_time==1) echo 'selected="selected"'; ?>>за месяц</option>
    <option value="2" <?php if($stat_time==2) echo 'selected="selected"'; ?>>за всё время</option>  
  </select>

</form>

<br /><br />

<div id="container" style="width: 700px; height: 400px; margin: 0 auto;"></div>

<?php echo $stat_text; ?>

<br /><br />


<ul class="actionButtons">
  <li><a href="<?php echo $mod_page; ?>"><img src="../assets/snippets/shopkeeper/style/default/img/cancel.gif" alt="">&nbsp; Назад</a></li>
</ul>

