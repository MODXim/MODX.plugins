<?Php
//---------------------------------------------------------------------------------
// mm_country_city
//--------------------------------------------------------------------------------- 
function mm_country_city($countryTV, $cityTV, $roles='', $templates='') {
  
  global $modx, $content, $mm_fields;
  $e = &$modx->Event;
  
  if (useThisRule($roles, $templates)) {
    
    // Your output should be stored in a string, which is outputted at the end
    // It will be inserted as a Javascript block (with jQuery), which is executed on document ready
    $output = '';    
    
    // You might want to check whether the current page's template uses the TVs that have been
    // supplied, to save processing page which don't contain them
    
    // Which template is this page using?
    if (isset($content['template'])) {
      $page_template = $content['template'];
    } else {
      // If no content is set, it's likely we're adding a new page at top level. 
      // So use the site default template. This may need some work as it might interfere with a default template set by MM?
      $page_template = $modx->config['default_template']; 
    }
    
    //Проверяем использует ли данный шаблон нужные нам TV
    $count = tplUseTvs($content['template'], array($countryTV, $cityTV));
    if ($count == false) {
      return;
    }    
      
    // We always put a JS comment, which makes debugging much easier
    $output .= "//  -------------- Country_city ------------- \n";

    //В ManagerManager нет массива со значениями TV, поэтому единственный способ узнать это через API MODX
    $tvs = $modx->getTemplateVars(array($countryTV, $cityTV) ,'*',$content['id'], 0);
    $tvcountry_value = !empty($tvs[0]['value'])?$tvs[0]['value']:0;
    $tvcity_value = !empty($tvs[1]['value'])?$tvs[1]['value']:0;
      
    //Идентификаторы HTML-элементов с TV. По ним будем искать нужные нам на странице    
    $tvcountry_id = $mm_fields[$countryTV]['fieldname'];
    $tvcity_id = $mm_fields[$cityTV]['fieldname'];
    //Выводим JS-скрипт
    $output .= '
      //Загружаем список стран      
      $j.get("'.$modx->config['site_url'].'/country_city.php??mode=country",
        function(data) {
          //Находим TV со страной          
          var s = $j("#'.$tvcountry_id.'");
          s.empty();
          $j(data).each( function () {
                  var option = $j("<option>").val(this.id);
                  option.text(this.title);
                  //Если ID страны равно значению TV, то выбираем данную страну
                  if (this.id=='.$tvcountry_value.')
                    option.attr("selected","selected");
                  s.append(option);
                 });
          //Если никакая страна не выбрана, то добавляем пустой элемент в список и делаем его активным          
          if (s.val()!='.$tvcountry_value.')
            s.prepend($j("<option>").attr("selected","selected"));
          //Навешиваем обработчик события смены страны          
          s.change(countrychange);
          //Загружаем города
          countrychange();
          },"json"
      );
      //callback-функция, вызываемая при смене страны
      var countrychange = function () {
        //Ищем TV со страной и получаем ID выбранной страны
        var country_id = $j("select#'.$tvcountry_id.'").val();
        if (country_id!=0) {
          $j.get("'.$modx->config['site_url'].'/country_city.php?mode=city&country_id="+country_id,
            function(data) {
              //Находим TV со городом
              var s = $j("#'.$tvcity_id.'");
              s.empty();
              $j(data).each( function () {
                var option = $j("<option>").val(this.id);
                option.text(this.title);
                  //Если ID города равно значению TV, то выбираем данный город
                if (this.id=='.$tvcity_value.')
                  option.attr("selected","selected");
                s.append(option);
              });
              //Если никакой город не выбран, то добавляем пустой элемент в список и делаем его активным          
              if (s.val()!='.$tvcity_value.')
                s.prepend($j("<option>").attr("selected","selected"));
            },"json"
          );          
        }
      }
  ';
  
  } // end if
  
  $e->output($output . "\n");  // Send the output to the browser
  
}

?>