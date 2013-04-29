//<?php
/**
INNOVA editor 5.1

//OnRichTextEditorRegister, OnRichTextEditorInit, OnInterfaceSettingsRender

 */

// Handle event
$e = &$modx->Event; 
switch ($e->name)
{    

        
        case "OnRichTextEditorRegister": // register only for backend
        $e->output("Innova"); 
         
        break;    

     
 case "OnRichTextEditorInit":
   if($editor!=='Innova') return;
   $e->output('
   <div style="padding:0px 30px; background:#fff;border:1px solid #ddd;margin:0 10px;margin-bottom:50px;">
   
   <script language=JavaScript src="/assets/plugins/Innova/innovaeditor.js"></script>
   <script language=JavaScript src="/assets/plugins/Innova/settings.js"></script></div>');
  
    break;
    
    
   default :    
      return; // stop here - this is very important. 
      break; 
}
