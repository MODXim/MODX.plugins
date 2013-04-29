//<?
/**
 * BAH - (Anti Hacker) created By Bumkaka
 * modify by Agel_Nash
 *
 * @category    plugin
 * @version     v 1.4
 * @internal    @events OnWebPageInit
 * @internal  @legacy_names BAH
 * @internal  @installset base, sample
 * @internal  @properties  &message=Сообщение;text;Hacker detected!!!!  o,O &white_list=Пропускаемые имена переменных;textarea; &black_list=Стоп слова при валидации;textarea;<script,/**\/,?>,<?,union,select,remove,where,delete ,$modx,mkdir,unset,query,file,eval,include,require,get_,stac,steam,curl,exec &cookie=Фильтровать $_COOKIE массив;list;true,false;false &post=Фильтровать $_POST массив;list;true,false;true &get=Фильтровать $_GET массив;list;true,false;true &light_list=Имена переменных для легкой фильтрации;textarea;q,id &action_list=Способ обработки пропущенных данных;textarea;escape,strip,htmlchars &lightCount=Число совпадений при легкой фильтрации;int;2
 */
if(!class_exists("PRIVATE_DB_FOR_EXAMPLE")){
     class PRIVATE_DB_FOR_EXAMPLE{
          function escape($str){
               return $str;
          }
     }
}
if(!class_exists("PRIVATE_EVENT_FOR_EXAMPLE")){
     class PRIVATE_EVENT_FOR_EXAMPLE{
          var $name="OnWebPageInit";
     }
}
if(!class_exists("DocumentParser")){
     class DocumentParser{
          var $db;
          var $Event;
          function __construct(){
               $this->db=new PRIVATE_DB_FOR_EXAMPLE;
               $this->Event=new PRIVATE_EVENT_FOR_EXAMPLE;
          }
          public function stripTags($str){
               return $str;
          }
     }
}
if(!$modx instanceof DocumentParser){
     $modx=new DocumentParser;
     $message="Hacker detected!!!!  o,O";
     $white_list="";
     $black_list='<script,/**\/,?>,<?,union,select,remove,where,delete ,$modx,mkdir,unset,query,file,eval,include,require,get_,stac,steam,curl,exec';
     $cookie="false";
     $post="true";
     $get="true";
     $light_list="q,id";
     $action_list="escape,strip,htmlchars";
     $lightCount=2;
}
if(!class_exists("Cleared")){
     class Cleared{
          static $_instances = null;
          private $lists=array('black'=>array(),'white'=>array(),'light'=>array(),'action'=>array());
          public $message;
          private $_modx=null;
          public $lightCount=1;
          private $error=array();
          private $errorDo=false;
          private $name='';

          private function __construct($modx){
               try{
                    if(!$modx instanceof DocumentParser){
                         throw new Exception("Ядро MODX не определено");
                    }
                    $this->_modx=$modx;
               }catch(Exception $e){
                    $this->error($e->getMessage());
               }

          }
          private final function __clone(){
               throw new Exception('Clone is not allowed');
          }
          static function init($modx){
               if (self::$_instances == NULL){
                    self::$_instances = new self($modx);
               }
               return self::$_instances;
          }
          private function error($msg){
               switch($this->errorDo){
                    case 'echo':{
                         echo $msg;
                         break;
                    }
                    case 'log':{
                         $this->error[]=$msg;
                         break;
                    }
                    default:{
                         die($msg);
                    }
               }
          }
          private function _check($data,$key=''){
               $flag = empty($data)? $data : $this->check($data,$key);
               if($flag===false){
                    die($this->message);
               }else{
                    return $flag;
               }
          }
          public function sanitarize($data,$name=''){
               $this->name=$name;
               if(is_array($data)){
                    foreach($data as $item=>$val){
                         $data[$item]=$this->_check($val,$item);
                    }
               }else{
                    $data=$this->_check($data);
               }
               return $data;
          }
          public function setList($name,$data){
               $flag=false;
               if(isset($this->lists[$name]) && !is_array($data)){
                    $data=explode(",",$data);
                    $this->lists[$name]=$data;
                    $flag=true;
               }
               try{
                    if(!$flag){
                         throw new Exception("Некорректная установка списка <strong>".$name."</strong>");
                    }
               }catch(Exception $e){
                    $this->error($e->getMessage());
               }
               return $flag;
          }

          public function getList($name,$mode='array'){
               $data=(isset($this->lists[$name]))?$this->lists[$name]:null;
               if($mode!='array' && $this->lists[$name]!=null && is_array($this->lists[$name])){
                    $data=implode(",",$this->lists[$name]);
               }
               return $data;
          }

          private function checkLight($str){
               $ret=false;
               $black=$this->getList('black');
               $i=0;
               foreach ($black as $word) {
                    $ret=$this->checkValue($str,$word);
                    if(!$ret){
                         $i++;
                         if($i>=$this->lightCount) {
                              break;
                         }
                    }
               }
               return (!$ret && $i>=$this->lightCount)?false:$str;
          }
          private function check($str,$key=''){
               $ret=false;
               if ($key!='' && in_array($key,$this->getList('white'))) $ret=$str;
               if ($key!='' && in_array($key,$this->getList('light')) && !is_array($str)) $ret=$this->checkLight($str);

               if(!$ret){
                    if(is_array($str)){
                         $ret=array();
                         foreach($str as $item=>$val){
                              $ret[$item]=$this->sanitarize($val);
                         }
                    }else{
                         $black=$this->getList('black');

                         foreach ($black as $word) {
                              $ret=$this->checkValue($str,$word);
                              if(!$ret) {
                                   break;
                              }
                         }
                    }
               }
               if(!$ret){
                    $ret=false;
               }else{
                    if(!is_array($ret)){
                         $ret=$this->doAction($str);
                    }
               }
               return $ret;
          }
          private function checkValue($str,$val){
               return ($val!='' && (strpos(strtolower($str), $val) !== false))?false:true;
          }
          private function doAction($str){
               $list=$this->getList('action');
               foreach($list as $item){
                    $str=$this->_DataAction($str,$item);
               }
               return $str;
          }
          private function _DataAction($str,$do){
               switch($do){
                    case 'escape':{
                         $str=$this->_modx->db->escape($str);
                         break;
                    }
                    case 'strip':{
                         $str=$this->_modx->stripTags($str);
                         break;
                    }
                    case 'htmlchars':{
                         $str=htmlspecialchars($str);
                         break;
                    }
                    default:{
                    }
               }
               return $str;
          }
     }
}

if($modx->Event->name=='OnWebPageInit'){
     $CLEAR=Cleared::init($modx);
     if(isset($message)){
          $CLEAR->message=$message;
     }
     if(isset($lightCount)){
          $CLEAR->lightCount=$lightCount; //Легкая фильтрация (необходимое число совпадений, чтобы запрос посчитался подозрительным)
     }
     if(isset($action_list)){
          $CLEAR->setList("action",$action_list); //Способ обработки всех входящих данных. Возможные значения escape,strip,htmlchars. обработка происходит в том порядке, в котором написана строка
     }
     if(isset($black_list)){
          $CLEAR->setList("black",$black_list); //СТОП список слов, наличие которых будет проверяться во всех входящих данных
     }
     if(isset($white_list)){
          $CLEAR->setList("white",$white_list); //Белый список с именами переменных, которые фильтровать не нужно
     }
     if(isset($light_list)){
     $CLEAR->setList("light",$light_list); //Имена переменных в массивах, которые будут проверяться с легкой фильтрацией
     }
     if(isset($get) && $get=='true' && count($_GET)>0){
          $_GET=$CLEAR->sanitarize($_GET,'get');
     }
     if(isset($post) && $post=='true' && count($_POST)>0){
          $_POST=$CLEAR->sanitarize($_POST,'post');
     }
     if(isset($cookie) && $cookie=='true' && count($_COOKIE)>0){
          $_COOKIE=$CLEAR->sanitarize($_COOKIE,'cookie');
     }
}
