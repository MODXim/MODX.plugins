/*** Editor Script Wrapper ***/
var oScripts=document.getElementsByTagName("script"); 
var sEditorPath;
for(var i=0;i<oScripts.length;i++)
  {
  var sSrc=oScripts[i].src.toLowerCase();
	if(sSrc.indexOf("innovaeditor.js")!=-1) sEditorPath=oScripts[i].src.replace(/innovaeditor.js/,"");
  }

document.write("<li"+"nk rel='stylesheet' href='"+sEditorPath+"scripts/style/istoolbar.css' type='text/css' />");

if(navigator.appName.indexOf('Microsoft')!=-1) {
  document.write("<scr"+"ipt src='"+sEditorPath+"scripts/istoolbar.js'></scr"+"ipt>");
  document.write("<scr"+"ipt src='"+sEditorPath+"scripts/editor.js'></scr"+"ipt>");
}
else if(navigator.userAgent.indexOf('Safari')!=-1) {
  document.write("<scr"+"ipt src='"+sEditorPath+"scripts/istoolbar.js'></scr"+"ipt>");
  document.write("<scr"+"ipt src='"+sEditorPath+"scripts_saf/editor.js'></scr"+"ipt>");
}  
else {
  document.write("<scr"+"ipt src='"+sEditorPath+"scripts/istoolbar.js'></scr"+"ipt>");
  document.write("<scr"+"ipt src='"+sEditorPath+"scripts_moz/editor.js'></scr"+"ipt>");
}  
