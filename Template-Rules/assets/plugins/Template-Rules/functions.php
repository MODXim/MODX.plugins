<?
//returns an array with the value of the TV and at what level was found. Level is used if multiple levels are configured in the TV
function TR_getTvValueAndLevel($startId, $templateRulesTvID){
	
	global $modx;
	
	//init level
	$level = 0;
	//init the TV value
	$tplVal = ''; 
	
	//find the first parent that has an defaultTemplate TV and on which level
	while($startId){
		//increase level
		$level++;
		
		//check if the parent has the defaultTemplate TV
		$sql = "SELECT * FROM ".$modx->db->config['table_prefix']."site_tmplvar_contentvalues WHERE tmplvarid = " . $templateRulesTvID . " AND contentid = " . $startId;
		$rs= $modx->dbQuery($sql);
		$row = $modx->fetchRow($rs);
		
		if($row && $row['value'] != ''){
			//stop while loop
			$startId = 0;
			//save TV value
			$tplVal = $row['value'];
		}else{
			//get next parent
			$sql = "SELECT parent FROM ".$modx->db->config['table_prefix']."site_content WHERE id = " . $startId;
			$rs= $modx->dbQuery($sql);
			$row = $modx->fetchRow($rs);
			
			$startId = $row['parent'];
		}
	}
	
	$retval = array("value"=>$tplVal, "level"=>$level);
	return $retval;
}

// gets the value of the default teplate. Used when a new document/resource is created
function TR_getDefaultTemplate($tvValueAndLevel){
	
	$tvValue = $tvValueAndLevel['value'];
	$level = $tvValueAndLevel['level'];
	
	$template = 'x';

	//set template to the defaultTemplate value
	$aTplVals = explode(",",$tvValue);
	if(isset($aTplVals[$level-1])){
		
		$defaultTemplateInfo = $aTplVals[$level-1];
		$hasAllowed = strpos($defaultTemplateInfo, '[');
		
		if($hasAllowed){//parse allowed templates
			
			$aAllowedTemplatesTemp = explode("[",$defaultTemplateInfo);
			$template = intval($aAllowedTemplatesTemp[0]);
			
		}else{ //no allowed templates functionality
			
			$template = intval($defaultTemplateInfo);
			
		}
	
	}else{
		//NTD
	}
	
	return $template;
}


//gets the js code for showing only configured templates
function TR_getJsCode($tvValueAndLevel, $documentTemplateId = ''){

	$tvValue = $tvValueAndLevel['value'];
	$level = $tvValueAndLevel['level'];
	
	$jsOutput = '';
	
	
	$aTplVals = explode(",",$tvValue);
	if(isset($aTplVals[$level-1])){
		
		$defaultTemplateInfo = $aTplVals[$level-1];
		$hasAllowed = strpos($defaultTemplateInfo, '[');
		
		if($hasAllowed){//parse allowed templates
		
		 	$aAllowedTemplatesTemp = explode("[",$defaultTemplateInfo);
		 	//prepare list for javascript, add default id and switch | to , for javascript array compatibility
		 	
		 	if($documentTemplateId){
		 		$allowedTemplatesList = '[' . $documentTemplateId . ',' . $aAllowedTemplatesTemp[0] . ',' . str_replace("|", ",", $aAllowedTemplatesTemp[1]);
		 	}else{
		 		$allowedTemplatesList = '[' . $aAllowedTemplatesTemp[0] . ',' . str_replace("|", ",", $aAllowedTemplatesTemp[1]);
		 	}
		 	
		 	

//javascript for hiding unwanted templates in drop down
$jsOutput = <<<DTJS
	<script type="text/javascript">
		
		window.addEvent('domready', function() {
			
			var allowedTemplatesList = $allowedTemplatesList;
             
            //remove unwanted templates from dropdown list
            $$("#template option").each(function(opt){
			 	
				if( allowedTemplatesList.contains( parseInt(opt.getProperty('value')) ) ){
			 		//nothing to do
			 	}else{
			 		opt.remove();
			 	}
			 	
			 });
			 
			 //remove empty optGroups
			 $$("#template optgroup").each(function(optGr){
			 	
				if(optGr.getText().trim()  == ""){
			 		
			 		optGr.remove();
			 	}else{
			 		//nothing to do
			 	}
			 	
			 });
			 

        });

	</script>
DTJS;

		}else{ 
			//NTD - no allowed templates functionality
		}
					
		
	}else{
		//NTD
	}
	
	return $jsOutput;

}



?>