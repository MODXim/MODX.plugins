/*** Editor Script Wrapper ***/
var oScripts=document.getElementsByTagName("script"); 
var sEditorPath;
for(var i=0;i<oScripts.length;i++)
  {
  var sSrc=oScripts[i].src.toLowerCase();
  if(sSrc.indexOf("scripts/innovaeditor.js")!=-1) sEditorPath=oScripts[i].src.replace(/innovaeditor.js/,"");
  }

document.write("<li"+"nk rel='stylesheet' href='"+sEditorPath+"style/istoolbar.css' type='text/css' />");
document.write("<scr"+"ipt src='"+sEditorPath+"istoolbar.js'></scr"+"ipt>");

if(navigator.appName.indexOf('Microsoft')!=-1) {
  document.write("<scr"+"ipt src='"+sEditorPath+"editor.js'></scr"+"ipt>");
} else if(navigator.userAgent.indexOf('Safari')!=-1) {
  document.write("<scr"+"ipt src='"+sEditorPath+"saf/editor.js'></scr"+"ipt>");
} else {
  document.write("<scr"+"ipt src='"+sEditorPath+"moz/editor.js'></scr"+"ipt>");
}  