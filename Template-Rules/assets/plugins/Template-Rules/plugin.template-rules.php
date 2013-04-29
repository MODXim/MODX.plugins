global $content;
$e = &$modx->Event;


$fctFile = $modx->config['base_path'] . 'assets/plugins/templaterules/functions.php';
include_once($fctFile);


switch($e->name) {
  	case 'OnDocFormPrerender':
    
	    if(($_REQUEST['pid'] > 0) && ($id == 0)) {
			//init parent
			$parent = $_REQUEST['pid'];
			//init level
			$level = 0;
			
			//get value of the TV
			$tvValueAndLevel = TR_getTvValueAndLevel($parent, $templateRulesTvID);
			
			//check for templateRules TV value
			if($tvValueAndLevel['value']){
				
				//set default template
				$defaultTemplate = TR_getDefaultTemplate($tvValueAndLevel);
				if($defaultTemplate) $content['template'] = $defaultTemplate;
				
				//output javascript code
				echo  TR_getJsCode($tvValueAndLevel);
			
			}else{
				//Inherit Template Plugin functionality
				if($parentTemplateId = $modx->getPageInfo($_REQUEST['pid'],0,'template')) {
			    	$content['template'] = $parentTemplateId['template'];
			    }
			}
		}	
	
	break;
	
	
	case 'OnDocFormRender':
		
		if($id > 0){//EXISTING DOCUMENT
		
			//init parent
			$parentTmp = $modx->getParent($id,'','id');
			$parent = $parentTmp['id'];
			
			
			
			//get value of the TV
			$tvValueAndLevel = TR_getTvValueAndLevel($parent, $templateRulesTvID);
			
			if($tvValueAndLevel['value']){

				//get template id for current document. 
				// - will be used to display the current template in the dropdown if it's not listed in the templateRules Tv
				// - prevents configuration errors of the templateRules Tv in case a user saves a document
				$documentTemplateIdTmp = $modx->getDocument($id, 'template');
				$documentTemplateId = $documentTemplateIdTmp['template'];
				
				//get javascript code
				echo  TR_getJsCode($tvValueAndLevel, $documentTemplateId);
			
			}else{
				//NTD - empty templateRules TV
			}

		}
		
	break;

  default:
    return;
    break;
}