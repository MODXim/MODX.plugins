/*
 Andchir - http://wdevblog.net.ru
 ----------------------------
 WelcomeIcons plugin for MODx Evolution
 ----------------------------
 Configuration: &icon_path1=1. Icon path:;string; &label1=1. Label:;string; &url1=1. Url:;string; &icon_path2=2. Icon path:;string; &label2=2. Label:;string; &url2=2. Url:;string; &icon_path3=3. Icon path:;string; &label3=3. Label:;string; &url3=3. Url:;string;
 System Events: OnManagerWelcomeHome
*/
 
$output = "";
$e = &$modx->Event;
if($e->name == 'OnManagerWelcomeHome'){
  for($i=1;$i<=3;$i++){
    if(!empty(${'label'.$i})){
      list($action,$id) = explode('||',${'url'.$i});
      $output .= '
        <span class="wm_button" style="border:0"><a class="hometblink" href="/manager/index.php?a='.$action.'&id='.$id.'"><img src="'.${'icon_path'.$i}.'" alt="'.${'label'.$i}.'" /><br />'.${'label'.$i}.'</a></span>
      ';
    }
  }
$e->output($output);
}