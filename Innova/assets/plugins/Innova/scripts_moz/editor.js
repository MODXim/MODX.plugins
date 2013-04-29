/***********************************************************
InnovaStudio WYSIWYG Editor 5.1
© 2010, InnovaStudio (www.innovastudio.com). All rights reserved.
************************************************************/

var editor = new Array();

/*** Utility Object ***/
var oUtil=new InnovaEditorUtil();
function InnovaEditorUtil()
    {
    /*** Localization ***/
  this.langDir="english";
  try{if(LanguageDirectory)this.langDir=LanguageDirectory;}catch(e){;}
    var oScripts=document.getElementsByTagName("script");
    for(var i=0;i<oScripts.length;i++)
        {
        var sSrc=oScripts[i].src.toLowerCase();
        if(sSrc.indexOf("scripts_moz/editor.js")!=-1)
            {
            this.scriptPath=oScripts[i].src.replace(/editor.js/,"");
            }
        else if(sSrc.indexOf("innovaeditor/innovaeditor.js")!=-1)/*optional, kalau embed innovaeditor.js (khusus firefox perlu)*/
            {
            if(!this.scriptPath)
				this.scriptPath=oScripts[i].src.replace(/innovaeditor.js/,"") + "scripts_moz/";
            }
        }
    this.scriptPathLang=this.scriptPath.replace(/\/scripts_moz/,"")+"scripts/language/"+this.langDir+"/";
  if(this.langDir=="english") 
  document.write("<scr"+"ipt src='"+this.scriptPathLang+"editor_lang.js'></scr"+"ipt>");
  /*** /Localization ***/
  
    this.oName;
    this.oEditor;
    this.obj;
    this.oSel;
    this.sType;
    this.bInside=bInside;
    this.useSelection=true;
    this.arrEditor=[];
    this.onSelectionChanged=function(){return true;};
    this.activeElement;
    this.activeModalWin;
    this.setEdit = setEdit;
    this.bOnLoadReplaced=false;
    
    this.spcCharCode=[[169, "&copy;"],[163, "&pound;"],[174, "&reg;"],[233, "&eacute;"],[201, "&Eacute;"],[8364,"&euro;"],[8220, "\""]];
    this.spcChar=[];
    for(var i=0;i<this.spcCharCode.length;i++)
      {
      this.spcChar[i]=[new RegExp(String.fromCharCode(this.spcCharCode[i][0]), "g"), this.spcCharCode[i][1]];
      }

    this.replaceSpecialChar=function(sHTML) 
      {
      for(var i=0;i<this.spcChar.length;i++)
        {
        sHTML=sHTML.replace(this.spcChar[i][0], this.spcChar[i][1]);
        }
      return sHTML;
      };
      
      /**
       * Initialize the editor
       * @param selector, can be id of textarea, classname of textarea or textarea object ifself.
       * @param opt, editor's properties.
      **/
      this.initializeEditor = function(tselector, opt) {
        var allText=[], txt, edtCnt;;

        if(typeof(tselector)=="object" && tselector.tagName && tselector.tagName=="TEXTAREA"){
          //if tselector is the object
          allText[0] = tselector;
        } else
        if(tselector.substr(0,1)=="#") {
          //if tselector is id
          txt = document.getElementById(tselector.substr(1));
          if(!txt) return;
          allText[0] = txt;
        } else {
          //if tselector is class name
          var all = document.getElementsByTagName("TEXTAREA");
          for(var i=0; i<all.length; i++) {
            if(all[i].className==tselector) {
              allText[i] = all[i];
            }
          }
        }

        for(var i=0; i<allText.length; i++) {
          txt = allText[i];

            if(txt.id || txt.id=="") txt.id = "editorarea" + i;

            //turn the textarea into editor.
            edtCnt = document.createElement("DIV");
            edtCnt.id = "innovaeditor" + i;

            txt.parentNode.insertBefore(edtCnt, txt);

            window["oEdit"+i] = new InnovaEditor("oEdit"+i);

            var objStyle;
            if( window.getComputedStyle ) {
              objStyle = window.getComputedStyle(txt,null);
            } else if( txt.currentStyle ) {
              objStyle = txt.currentStyle;
            } else {
              objStyle = {width:window["oEdit"+i].width, height:window["oEdit"+i].height};
            }

            window["oEdit"+i].width=objStyle.width;
            window["oEdit"+i].height=objStyle.height;

            if(opt) {
              for(var it in opt) {
                window["oEdit"+i][it] = opt[it];
              }
            }

            window["oEdit"+i].REPLACE(txt.id, "innovaeditor" + i);          

        }    

      }; //enf of initializeEditor
    
    
    };

/*** Focus stuff ***/
function bInside(oElement)
    {
    while(oElement!=null)
        {
        if(oElement.designMode && oElement.designMode=="on")return true;
        oElement=oElement.parentNode;
        }
    return false;
    };

function checkFocus()
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    var parent = getSelectedElement(oSel);
    if(parent!=null)
        {
        if(!bInside(parent))return false;
        }
    else
        {
        if(!bInside(parent))return false;
        }
    return true;
    };

function iwe_focus()
    {
    var oEditor=document.getElementById("idContent"+this.oName);
    if(oEditor) oEditor.contentWindow.focus();
    };

/*** setEdit ***/
function setEdit(oName) 
  {
  if ((oName != null) && (oName!="")) 
    {
    try 
      { 
      var wnd=document.getElementById("idContent"+oName);
      wnd.contentDocument.designMode="on";
      wnd.focus();
      } catch(e) {}
    }
  else 
    {
    for (var i=0; i<this.arrEditor.length; i++)
      {
      try 
        {
          var wnd=document.getElementById("idContent"+this.arrEditor[i]).contentWindow;
          wnd.document.designMode="on";
          var r = wnd.getSelection().getRangeAt(0);
          r.selectNode(wnd.document.getElementsByTagName("Body")[0]);
          r.collapse(true);
          wnd.focus();
        } catch(e) {}
      }
    }
  };

/*** icons related ***/
var iconHeight;

/*** EDITOR OBJECT ***/
function InnovaEditor(oName)
    {
    this.oName=oName;
    this.init=initISEditor;
    this.RENDER=RENDER;

    this.loadHTML=loadHTML;
    this.loadHTMLFull=loadHTMLFull;
    this.getHTMLBody=getHTMLBody;
    this.getHTML=getHTML;
    this.getXHTMLBody=getXHTMLBody;
    this.getXHTML=getXHTML;
    this.getTextBody=getTextBody;
    this.putHTML=putHTML;//source dialog
    this.css="";
    
    this.onKeyPress=function(){return true;};
    
    this.styleSelectionHoverBg="#cccccc";
      this.styleSelectionHoverFg="white";

    //clean
    this.cleanEmptySpan=cleanEmptySpan;
    this.cleanFonts=cleanFonts;
    this.cleanTags=cleanTags;
    this.replaceTags=replaceTags;
    this.cleanDeprecated=cleanDeprecated;

    this.doClean=doClean;
    this.applySpanStyle=applySpanStyle;

    this.bInside=bInside;
    this.checkFocus=checkFocus;
    this.focus=iwe_focus;

    this.doCmd=doCmd;
    this.applyParagraph=applyParagraph;
    this.applyFontName=applyFontName;
    this.applyFontSize=applyFontSize;
    this.applyBullets=applyBullets;
    this.applyNumbering=applyNumbering;
    this.applyJustifyLeft=applyJustifyLeft;
    this.applyJustifyCenter=applyJustifyCenter;
    this.applyJustifyRight=applyJustifyRight;
    this.applyJustifyFull=applyJustifyFull;
    this.applyBlockDirLTR=applyBlockDirLTR;
    this.applyBlockDirRTL=applyBlockDirRTL;
    this.applySpan=applySpan;
    this.makeAbsolute=makeAbsolute;
    this.insertHTML=insertHTML;
    this.clearAll=clearAll;
    this.insertCustomTag=insertCustomTag;
    this.selectParagraph=selectParagraph;

    this.useB=false;//not used

    this.hide=hide;

    this.width="700px";
    this.height="350px";
    this.publishingPath="";//ex."../../../localhost/innovastudio/default.htm"

    var oScripts=document.getElementsByTagName("script");
    for(var i=0;i<oScripts.length;i++)
      {
      var sSrc=oScripts[i].src.toLowerCase();
      if(sSrc.indexOf("scripts_moz/editor.js")!=-1)
        {
        this.scriptPath=oScripts[i].src.replace(/editor.js/,"");
        break;
        }
      else if(sSrc.indexOf("innovaeditor.js")!=-1) //Utk mengatasi masalah di NS7.1 (NS7.2 & 8.0 tdk masalah)
        {
        this.scriptPath=oScripts[i].src.replace(/innovaeditor.js/,"scripts_moz/"); break;
        }
      }
  
  /*** icons related ***/
    this.iconPath="scripts/icons/";
    this.iconWidth=29; //25;
    this.iconHeight=25; //22;
  /*** /icons related ***/
  
    this.dropTopAdjustment_moz=0;
    this.dropLeftAdjustment_moz=0;
    this.heightAdjustment=0;  //not use, for IE only

    this.applyColor=applyColor;
    this.customColors=[];//["#ff4500","#ffa500","#808000","#4682b4","#1e90ff","#9400d3","#ff1493","#a9a9a9"];
    this.oColor1 = new ColorPicker("oColor1",this.oName);//to call: oEdit1.oColor1
    this.oColor2 = new ColorPicker("oColor2",this.oName);//rendered id: ...oColor1oEdit1
    this.expandSelection=expandSelection;

    this.useLastForeColor=false;
    this.useLastBackColor=false;
    this.stateForeColor="";
    this.stateBackColor="";

    this.fullScreen=doFullScreen;
    this.stateFullScreen=false;

    this.getElm=iwe_getElm;

    this.features=[];
    
    //diff: "Search","Cut","Copy","Paste","Guidelines" 

    /*
    this.buttonMap=["Save","FullScreen","Preview","Print","Search","SpellCheck",
    "Cut","Copy","Paste","PasteWord","PasteText","|","Undo","Redo","|",
    "ForeColor","BackColor","|","Bookmark","Hyperlink",
    "Image","Flash","Media","ContentBlock","InternalLink","InternalImage","CustomObject","|",
    "Table","Guidelines","Absolute","|","Characters","Line",
    "Form","RemoveFormat","HTMLFullSource","HTMLSource","XHTMLFullSource",
    "XHTMLSource","ClearAll","BRK", 
    "StyleAndFormatting","Styles","|","CustomTag","Paragraph","FontName","FontSize","|",
    "Bold","Italic",
    "Underline","Strikethrough","Superscript","Subscript","|",
    "JustifyLeft","JustifyCenter","JustifyRight","JustifyFull","|",
    "Numbering","Bullets","|","Indent","Outdent","LTR","RTL"];//complete, default
    */
    
    this.buttonMap=["Save","FullScreen","Preview","Print","Search","SpellCheck",
    "Cut","Copy","Paste","PasteWord","PasteText","Undo","Redo",
    "ForeColor","BackColor","Bookmark","Hyperlink",
    "Image","Flash","Media","ContentBlock","InternalLink","InternalImage","CustomObject",
    "Table","Guidelines","Absolute","Characters","Line",
    "Form","RemoveFormat","HTMLFullSource","HTMLSource","XHTMLFullSource",
    "XHTMLSource","ClearAll","BRK", 
    "StyleAndFormatting","Styles","CustomTag","Paragraph","FontName","FontSize",
    "Bold","Italic",
    "Underline","Strikethrough","Superscript","Subscript",
    "JustifyLeft","JustifyCenter","JustifyRight","JustifyFull",
    "Numbering","Bullets","Indent","Outdent","LTR","RTL"];//complete, default
    
    //diff: btnSearch, btnCut, btnCopy, btnPaste, btnGuidelines
    this.btnSave=false;this.btnPreview=true;this.btnFullScreen=true;this.btnPrint=false;this.btnSearch=true;
    this.btnSpellCheck=false;this.btnTextFormatting=true;
    this.btnListFormatting=true;this.btnBoxFormatting=true;this.btnParagraphFormatting=true;this.btnCssText=true;this.btnCssBuilder=false;
    this.btnStyles=false;this.btnParagraph=true;this.btnFontName=true;this.btnFontSize=true;
    this.btnCut=true;this.btnCopy=true;this.btnPaste=true;this.btnPasteText=false;this.btnUndo=true;this.btnRedo=true;
    this.btnBold=true;this.btnItalic=true;this.btnUnderline=true;
    this.btnStrikethrough=false;this.btnSuperscript=false;this.btnSubscript=false;
    this.btnJustifyLeft=true;this.btnJustifyCenter=true;this.btnJustifyRight=true;this.btnJustifyFull=true;
    this.btnNumbering=true;this.btnBullets=true;this.btnIndent=true;this.btnOutdent=true;
    this.btnLTR=false;this.btnRTL=false;this.btnForeColor=true;this.btnBackColor=true;
    this.btnHyperlink=true;this.btnBookmark=true;this.btnCharacters=true;this.btnCustomTag=false;
    this.btnImage=true;this.btnFlash=false;this.btnMedia=false;
    this.btnTable=true;this.btnGuidelines=true;
    this.btnAbsolute=true;this.btnPasteWord=true;this.btnLine=true;
    this.btnForm=true;this.btnRemoveFormat=true;
    this.btnHTMLFullSource=false;this.btnHTMLSource=false;
    this.btnXHTMLFullSource=false;this.btnXHTMLSource=true;
    this.btnClearAll=false;

    this.tabs=[
    ["tabHome", "Home", ["grpEdit", "grpFont", "grpPara"]],
    ["tabStyle", "Insert", ["grpInsert", "grpTables", "grpMedia"]]
    ];

    this.groups=[
    ["grpEdit", "", ["XHTMLSource", "FullScreen", "Search", "RemoveFormat", "BRK", "Undo", "Redo", "Cut", "Copy", "Paste", "PasteWord", "PasteText"]],
    ["grpFont", "", ["FontName", "FontSize", "Strikethrough", "Superscript", "BRK", "Bold", "Italic", "Underline", "ForeColor", "BackColor"]],
    ["grpPara", "", ["Paragraph", "Indent", "Outdent", "Styles", "StyleAndFormatting", "BRK", "JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyFull", "Numbering", "Bullets"]],
    ["grpInsert", "", ["Hyperlink", "Bookmark", "BRK", "Image"]],
    ["grpTables", "", ["Table", "BRK", "Guidelines"]],
    ["grpMedia", "", ["Media", "Flash", "BRK", "Characters", "Line"]]
    ];

    this.toolbarMode=0; //0:standard, 1:tab, 2:group
    this.showResizeBar=true;    
    this.pasteTextOnCtrlV=false;

    //*** CMS FUNCTIONS ***
    this.cmdAssetManager="";
    this.cmdFileManager="";
    this.cmdImageManager="";
    this.cmdMediaManager="";
    this.cmdFlashManager="";

    this.btnContentBlock=false;
    this.cmdContentBlock=";";//needs ;
    this.btnInternalLink=false;
    this.cmdInternalLink=";";//needs ;
    this.insertLink=insertLink;
    this.btnCustomObject=false;
    this.cmdCustomObject=";";//needs ;
    this.btnInternalImage=false;
    this.cmdInternalImage=";";//needs ;
    //**********

    this.arrStyle=[];
    this.isCssLoaded=false;
    this.openStyleSelect=openStyleSelect;

    this.arrParagraph=[[getTxt("Heading 1"),"H1"],
        [getTxt("Heading 2"),"H2"],
        [getTxt("Heading 3"),"H3"],
        [getTxt("Heading 4"),"H4"],
        [getTxt("Heading 5"),"H5"],
        [getTxt("Heading 6"),"H6"],
        [getTxt("Preformatted"),"PRE"],
        [getTxt("Normal (P)"),"P"],
        [getTxt("Normal (DIV)"),"DIV"]];

    this.arrFontName=["Arial","Arial Black","Arial Narrow",
        "Book Antiqua","Bookman Old Style","Century Gothic",
        "Comic Sans MS","Courier New","Franklin Gothic Medium",
        "Garamond","Georgia","Impact","Lucida Console",
        "Lucida Sans","Lucida Unicode","Modern",
        "Monotype Corsiva","Palatino Linotype","Roman",
        "Script","Small Fonts","Symbol","Tahoma",
        "Times New Roman","Trebuchet MS","Verdana",
        "Webdings","Wingdings","serif","sans-serif",
        "cursive","fantasy","monospace"];

    this.arrFontSize=[[getTxt("Size 1"),"1"],
        [getTxt("Size 2"),"2"],
        [getTxt("Size 3"),"3"],
        [getTxt("Size 4"),"4"],
        [getTxt("Size 5"),"5"],
        [getTxt("Size 6"),"6"],
        [getTxt("Size 7"),"7"]];

    this.arrCustomTag=[];//eg.[["Full Name","{%full_name%}"],["Email","{%email%}"]];

    this.docType="";
    this.html="<html>";
    this.headContent="";
    this.preloadHTML="";

    this.onSave=function(){document.getElementById("iwe_btnSubmit"+this.oName).click()};

    this.onFullScreen=function(){return true;};
    this.onNormalScreen=function(){return true;};

    this.initialRefresh=false;//not used

    this.doUndo=doUndo;
    this.doRedo=doRedo;
    this.saveForUndo=saveForUndo;
    this.doUndoRedo=doUndoRedo;

    this.arrUndoList=[];
    this.arrRedoList=[];

    this.useTagSelector=true;
    this.TagSelectorPosition="bottom";
    this.moveTagSelector=moveTagSelector;
    this.selectElement=selectElement;
    this.removeTag=removeTag;
    this.doClick_TabCreate=doClick_TabCreate;
    this.doRefresh_TabCreate=doRefresh_TabCreate;

    this.arrCustomButtons = [["CustomName1","alert(0)","caption here","btnSave.gif"],
                            ["CustomName2","alert(0)","caption here","btnSave.gif"]];

    this.onSelectionChanged=function(){return true;};

    this.spellCheckMode="ieSpell";
    
    this.encodeIO=false;
    this.changeHeight = changeHeight;

    this.REPLACE=REPLACE;
    this.mode="XHTMLBody";
    this.idTextArea;

    var me=this;
    this.tbar=new ISToolbarManager(this.oName);
    this.tbar.iconPath = this.scriptPath.substring(0, this.scriptPath.indexOf("scripts_moz/"))+this.iconPath;
    
    editor[editor.length] = this;
    
    return this;
    };

/*** Undo/Redo ***/
function saveForUndo()
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var obj=this;
    if(obj.arrUndoList[0])
        if(oEditor.document.body.innerHTML==obj.arrUndoList[0][0])return;
    for(var i=20;i>1;i--)obj.arrUndoList[i-1]=obj.arrUndoList[i-2];
    obj.focus();
    var oSel=oEditor.getSelection();
    var range = oSel.getRangeAt(0);
    obj.arrUndoList[0]=[oEditor.document.body.innerHTML, range.cloneRange()];

    this.arrRedoList=[];//clear redo list

    if(this.btnUndo) this.tbar.btns["btnUndo"+this.oName].setState(1);
    if(this.btnRedo) this.tbar.btns["btnRedo"+this.oName].setState(5);
    };
function doUndo() 
  {
    this.doUndoRedo(this.arrUndoList, this.arrRedoList);
  };

function doRedo() 
  {
    this.doUndoRedo(this.arrRedoList, this.arrUndoList);
  };
function doUndoRedo(listA, listB)
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var obj=this;
    if(!listA[0])return; //return of undo/redo array empty

    for(var i=20;i>1;i--)listB[i-1]=listB[i-2];
    var oSel=oEditor.getSelection();
    var range = oSel.getRangeAt(0);
    listB[0]=[oEditor.document.body.innerHTML, range.cloneRange()];

    sHTML=listA[0][0];

    oEditor.document.body.innerHTML=sHTML;

    oSel = oEditor.getSelection();
    oSel.removeAllRanges();
    oSel.addRange(listA[0][1]);

    for(var i=0;i<19;i++)listA[i]=listA[i+1];
    listA[19]=null;
    realTime(this);
    };

/*** RENDER ***/
var bOnSubmitOriginalSaved=false;
function REPLACE(idTextArea, dvId)
  {
  this.idTextArea=idTextArea;
  var oTextArea=document.getElementById(idTextArea);
  oTextArea.style.display="none";
  var oForm=oTextArea.form;
  if(oForm)
    {
    if(!bOnSubmitOriginalSaved)
      {
      if(oForm.onsubmit)
      onsubmit_original=oForm.onsubmit;
      
      bOnSubmitOriginalSaved=true;  
      }
    oForm.onsubmit = new Function("return onsubmit_new()");
    }

  var sContent=document.getElementById(idTextArea).value;
  sContent=sContent.replace(/&/g,"&amp;");
  sContent=sContent.replace(/</g,"&lt;");
  sContent=sContent.replace(/>/g,"&gt;");

  this.RENDER(sContent, dvId);
  };
function onsubmit_new()
  {
  var sContent;
  for(var i=0;i<oUtil.arrEditor.length;i++)
    {
    var oEdit=eval(oUtil.arrEditor[i]);
    if(oEdit.mode=="HTMLBody")sContent=oEdit.getHTMLBody();
    if(oEdit.mode=="HTML")sContent=oEdit.getHTML();
    if(oEdit.mode=="XHTMLBody")sContent=oEdit.getXHTMLBody();
    if(oEdit.mode=="XHTML")sContent=oEdit.getXHTML();
    document.getElementById(oEdit.idTextArea).value=sContent;
    }
  if(onsubmit_original)return onsubmit_original();
  };
function onsubmit_original(){};

function RENDER(sPreloadHTML, dvId)
    {
  /*** icons related ***/
  iconHeight=this.iconHeight;
  
    /*** Tetap Ada (For downgrade compatibility) ***/    
    if(sPreloadHTML.substring(0,4)=="<!--" &&
  sPreloadHTML.substring(sPreloadHTML.length-3)=="-->")
  sPreloadHTML=sPreloadHTML.substring(4,sPreloadHTML.length-3);

  if(sPreloadHTML.substring(0,4)=="<!--" &&
  sPreloadHTML.substring(sPreloadHTML.length-6)=="--&gt;")
  sPreloadHTML=sPreloadHTML.substring(4,sPreloadHTML.length-6);
  
  /*** Converting back HTML-encoded content (kalau tdk encoded tdk masalah) ***/  
  sPreloadHTML=sPreloadHTML.replace(/&lt;/g,"<");
  sPreloadHTML=sPreloadHTML.replace(/&gt;/g,">");
  sPreloadHTML=sPreloadHTML.replace(/&amp;/g,"&");

  /*** enable required buttons ***/
  if(this.cmdContentBlock!=";")this.btnContentBlock=true;
  if(this.cmdInternalLink!=";")this.btnInternalLink=true;
  if(this.cmdInternalImage!=";")this.btnInternalImage=true; 
  if(this.cmdCustomObject!=";")this.btnCustomObject=true;
  if(this.arrCustomTag.length>0)this.btnCustomTag=true;
  if(this.mode=="HTMLBody"){this.btnXHTMLSource=true;this.btnXHTMLFullSource=false;}
  if(this.mode=="HTML"){this.btnXHTMLFullSource=true;this.btnXHTMLSource=false;}
  if(this.mode=="XHTMLBody"){this.btnXHTMLSource=true;this.btnXHTMLFullSource=false;}
  if(this.mode=="XHTML"){this.btnXHTMLFullSource=true;this.btnXHTMLSource=false;}

    /*** features ***/
    var bUseFeature=false;
    if(this.features.length>0)
        {
        bUseFeature=true;
        for(var i=0;i<this.buttonMap.length;i++)
            eval(this.oName+".btn"+this.buttonMap[i]+"=true");//ex: oEdit1.btnStyleAndFormatting=true (no problem), oEdit1.btn|=true (no problem), oEdit1.btnBRK=true (no problem)

        this.btnTextFormatting=false;this.btnListFormatting=false;
        this.btnBoxFormatting=false;this.btnParagraphFormatting=false;
        this.btnCssText=false;this.btnCssBuilder=false;
        for(var j=0;j<this.features.length;j++)
            eval(this.oName+".btn"+this.features[j]+"=true");//ex: oEdit1.btnTextFormatting=true

        for(var i=0;i<this.buttonMap.length;i++)
            {
            sButtonName=this.buttonMap[i];          
            bBtnExists=false;
            for(var j=0;j<this.features.length;j++)
                if(sButtonName==this.features[j])bBtnExists=true;//ada;

            if(!bBtnExists)//tdk ada; set false
                eval(this.oName+".btn"+sButtonName+"=false");//ex: oEdit1.btnBold=false, oEdit1.btn|=false (no problem), oEdit1.btnBRK=false (no problem)
            }
        //Remove:"TextFormatting","ListFormatting",dst.=>tdk perlu(krn diabaikan)
        this.buttonMap=this.features;
        }
    /*** /features ***/

    this.preloadHTML=sPreloadHTML;

    var sHTMLDropMenus="";
    var sHTMLIcons="";
    var sTmp="";

    //Render Color Picker (forecolor)
    this.oColor1.url=this.scriptPath+"color_picker_fg.htm";
    this.oColor1.onShow = new Function(this.oName+".hide()");
    this.oColor1.onMoreColor = new Function(this.oName+".hide()");
    this.oColor1.onPickColor = new Function(this.oName+".applyColor('ForeColor', "+this.oName+".oColor1.color)");
    this.oColor1.onRemoveColor = new Function(this.oName+".applyColor('ForeColor','')");
    this.oColor1.txtCustomColors=getTxt("Custom Colors");
    this.oColor1.txtMoreColors=getTxt("More Colors...");
    
    //Render Color Picker (backcolor)
    this.oColor2.url=this.scriptPath+"color_picker_bg.htm";
    this.oColor2.onShow = new Function(this.oName+".hide()");
    this.oColor2.onMoreColor = new Function(this.oName+".hide()");
    this.oColor2.onPickColor = new Function(this.oName+".applyColor('hilitecolor', "+this.oName+".oColor2.color)");
    this.oColor2.onRemoveColor = new Function(this.oName+".applyColor('HiliteColor','')");
    this.oColor2.txtCustomColors=getTxt("Custom Colors");
    this.oColor2.txtMoreColors=getTxt("More Colors...");
    
    var me=this;

    if(this.toolbarMode!=0) {
      var tmp=null, tmpTb, grpMap=new Object();
      //create toolbar.
      for (var i=0;i<this.buttonMap.length;i++) {
        eval(this.oName+".btn"+this.buttonMap[i]+"=false");
      }
      for (var i=0; i<this.groups.length;i++) {
        tmp=this.groups[i];
        tmpTb=this.tbar.createToolbar(this.oName+"tbar"+tmp[0]);
        tmpTb.onClick=function(id) {tbAction(tmpTb, id, me, me.oName);};
        tmpTb.style.toolbar="main_istoolbar";
        tmpTb.iconPath=this.scriptPath.substring(0, this.scriptPath.indexOf("scripts_moz/"))+this.iconPath;
        tmpTb.btnWidth=this.iconWidth;
        tmpTb.btnHeight=this.iconHeight;
        for (var j=0;j<tmp[2].length;j++) {
          eval(this.oName+".btn"+tmp[2][j]+"=true");
        }
        buildToolbar(tmpTb, this, tmp[2]);
        grpMap[tmp[0]]=tmp[1];
      }

      //create tab
      if(this.toolbarMode==1) {
        var eTab=this.tbar.createTbTab("tabCtl"+this.oName), tmpGrp;
        for(var i=0; i<this.tabs.length; i++) {
          tmp=this.tabs[i];
          tmpGrp=this.tbar.createTbGroup(this.oName+"grp"+tmp[0]);
          for (var j=0; j<tmp[2].length;j++) {
            tmpGrp.addGroup(this.oName+tmp[2][j], grpMap[tmp[2][j]] , this.oName+"tbar"+tmp[2][j]);
          }
          eTab.addTab(this.oName+tmp[0], tmp[1], tmpGrp);
        }      
      } else if(this.groups.length>0) {
          var tmpGrp;
          tmpGrp=this.tbar.createTbGroup(this.oName+"grp");
          for (var i=0; i<this.groups.length;i++) {
            tmp=this.groups[i];
            tmpGrp.addGroup(this.oName+tmp[0], grpMap[tmp[0]] , this.oName+"tbar"+tmp[0]);
          }      
      }


    } else {
      var orTb=this.tbar.createToolbar(this.oName);  
        orTb.onClick=function(id) {tbAction(orTb, id, me, me.oName);};
        //orTb.style.toolbar="main_istoolbar";
        orTb.iconPath=this.scriptPath.substring(0, this.scriptPath.indexOf("scripts_moz/"))+this.iconPath;
        orTb.btnWidth=this.iconWidth;
        orTb.btnHeight=this.iconHeight;
        buildToolbar(orTb, this, this.buttonMap);
    }

    var sHTML="";
    var icPath=this.scriptPath.substring(0, this.scriptPath.indexOf("scripts_moz/"))+this.iconPath;    

    if(!document.getElementById("id_refresh_z_index"))
        sHTML+="<div id=id_refresh_z_index style='margin:0px'></div>";

    sHTML+="<table id=idArea"+this.oName+" name=idArea"+this.oName+" border='0px' "+
            "cellpadding=0 cellspacing=0 width='"+this.width+"' height='"+this.height+"' style='border-bottom:#cfcfcf 1px solid'>"+
            "<tr><td colspan=2 style=\"padding:0px;border:#cfcfcf 0px solid;background:url('"+icPath+"bg.gif')\">"+
            "<table cellpadding=0 cellspacing=0 border=0 width=100%><tr><td dir=ltr style='padding:0px;'>"+
            this.tbar.render()+
            "</td></tr></table>"+
            "</td></tr>"+
            "<tr id=idTagSelTopRow"+this.oName+"><td colspan=2 id=idTagSelTop"+this.oName+" height=0px style='padding:0px;'></td></tr>";


    sHTML+="<tr style='width:100%;height:100%'><td colspan=2 valign=top height=100% style='padding:0px;background:white;padding-right:0px;'>";
    
    sHTML+="<table id='cntContainer"+this.oName+"' cellpadding=0 cellspacing=0 width='100%' height='100%' style='margin-top:0px;'><tr style='width:100%;height:100%'><td width='100%' height='100%' style='padding:0px;border:solid 1px #cfcfcf;border-bottom:none'>";//StyleSelect

    sHTML+="<iframe style='width:100%;height:100%;border:none;' "+
            " name=idContent"+ this.oName + " id=idContent"+this.oName+ "></iframe>";

    sHTML+="<iframe style='width:1px;height:1px;overflow:auto;border:0px' id=\"myStyle"+this.oName+"\" name=\"myStyle"+this.oName+"\" src='"+this.scriptPath+"blank.gif'></iframe>";

    sHTML+="</td><td id=idStyles"+this.oName+" style='padding:0px;background:#f4f4f4'></td></tr></table>";//StyleSelect

    sHTML+="</td></tr>";
    sHTML+="<tr id=idTagSelBottomRow"+this.oName+"><td colspan=2 id=idTagSelBottom"+this.oName+" style='padding:0px;'></td></tr>";
    
    if(this.showResizeBar) {
      sHTML+="<tr id=idResizeBar"+this.oName+"><td colspan=2 style='padding:0px;'><div style='cursor:n-resize;' class='resize_bar' onmousedown=\"onEditorStartResize(event, this, '"+this.oName+"')\" ></div></td></tr>";
    }
    
    sHTML+="</table>";

    sHTML+=sHTMLDropMenus;//dropdown
    
    sHTML+="<input type=submit name=iwe_btnSubmit"+this.oName+" id=iwe_btnSubmit"+this.oName+" value=SUBMIT style='display:none' >";//hidden submit button

    if(dvId) {
      var edtStr=[];
      edtStr[0]=sHTML;
      document.getElementById(dvId).innerHTML=edtStr.join("");
    } else {
      document.write(sHTML);
    }
       
    var clPick=document.getElementById("isClPiker"+this.oName);
    if(!clPick) { 
      clPick = document.createElement("DIV");
      clPick.id="isClPiker"+this.oName;
      clPick.innerHTML=this.oColor1.generateHTML() + this.oColor2.generateHTML();
      document.body.insertBefore(clPick, document.body.childNodes[0]);
    }
    

    var me=this;
    setTimeout(function() {me.init()},10);
 
    };


/*=====================================*/
/*=========RESIZE TOOLBAR DRAG=========*/
/*=====================================*/

function onEditorStartResize(ev, elm, oName) {
  
  document.onmousemove=onEditorResize;
  document.onmouseup=onEditorStopResize;
  document.onselectstart=function() { return false;};
  document.ondragstart=function() { return false;};
  document.body.style.cursor="n-resize";
  
  oUtil.currentResized = eval(oName);
  oUtil.resizeInit = {x:ev.screenX, y:ev.screenY};

  if(!oUtil.isWindow ) oUtil.isWindow = new ISWindow(oName);
  oUtil.isWindow.showOverlay();
  
  ev.preventDefault();
  
};

function onEditorStopResize(event) {

  oUtil.resizeOffset = {dx:event.screenX-oUtil.resizeInit.x, dy:event.screenY-oUtil.resizeInit.y};
  oUtil.currentResized.changeHeight(oUtil.resizeOffset.dy);

  oUtil.isWindow.hideOverlay();

  document.onmousemove=null;
  document.onmouseup=null;
  document.body.style.cursor="default";
};

function onEditorResize(event) {
  
  oUtil.resizeOffset = {dx:event.screenX-oUtil.resizeInit.x, dy:event.screenY-oUtil.resizeInit.y};
  oUtil.currentResized.changeHeight(oUtil.resizeOffset.dy);
  oUtil.resizeInit = {x:event.screenX, y:event.screenY};

};

/*=====================================*/
/*======END OF RESIZE TOOLBAR DRAG=====*/
/*=====================================*/


function initISEditor() {

    if(this.useTagSelector)
        {
        if(this.TagSelectorPosition=="bottom")this.TagSelectorPosition="top";
        else this.TagSelectorPosition="bottom";
        this.moveTagSelector()
        }

    var oEditor = document.getElementById("idContent"+this.oName).contentWindow;

    oUtil.oName=this.oName;//default active editor
    oUtil.oEditor=oEditor;
    oUtil.obj=this;

    oUtil.arrEditor.push(this.oName);

    try { oEditor.document.designMode="on"; } catch(e) {}

    var arrA = String(this.preloadHTML).match(/<HTML[^>]*>/ig);
    if(arrA)
        {//full html          
          this.loadHTMLFull(this.preloadHTML);
        }
    else
        {
        this.loadHTML(this.preloadHTML);
        }

    /***** Replace current body onload ******/
    if(!oUtil.bOnLoadReplaced)
      {
      if(window.onload)onload_original=window.onload;
      window.onload = new Function("onload_new()");
      oUtil.bOnLoadReplaced=true;
      }
    /****************************************/

    this.focus();
    
    try {
      var cnt = oEditor.document.body.innerHTML;
      cnt = cnt.replace(/\s+/gi, "");
      if(cnt=="") {
        oEditor.document.body.innerHTML="<br class=\"innova\" />";
      }
      
      var range = oEditor.document.createRange();
      range.selectNode(oEditor.document.body.childNodes[0]);
      range.collapse(true);
      
      var sel = oEditor.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);      
      
    } catch (e) {}
    
    this.focus();
};

function buildToolbar(tb, oEdt, btnMap) {
  var oName=oEdt.oName;
  
  for(var i=0;i<btnMap.length;i++)
    {
    sButtonName=btnMap[i];
    switch(sButtonName)
      {
      case "|":
          tb.addSeparator();
          break;
      case "BRK":
          tb.addBreak();
          break;
      case "Save":
          if(oEdt.btnSave)tb.addButton("btnSave"+oName, "btnSave.gif", getTxt("Save"));
          break;
      case "Preview":
          if(oEdt.btnPreview) {
            tb.addDropdownButton("btnPreview"+oName, "ddPreview"+oName, "btnPreview.gif",getTxt("Preview"));
            var pvDD=new ISDropdown("ddPreview"+oName); 
            pvDD.addItem("btnPreview1"+oName, "640x480");
            pvDD.addItem("btnPreview2"+oName, "800x600");
            pvDD.addItem("btnPreview3"+oName, "1024x768");
            pvDD.onClick=function(id) {ddAction(tb, id, oEdt, oEdt.oName)};
          }
          break;
      case "FullScreen":
          if(oEdt.btnFullScreen)tb.addButton("btnFullScreen"+oName, "btnFullScreen.gif",getTxt("Full Screen"));
          break;
      case "Print":
          if(oEdt.btnPrint)tb.addButton("btnPrint"+oName,"btnPrint.gif",getTxt("Print"));
          break;
      case "Search":
        if(oEdt.btnSearch)tb.addButton("btnSearch"+oName,"btnSearch.gif",getTxt("Search"));
        break;
      case "SpellCheck":
        if(oEdt.btnSpellCheck)
          {
          if (oEdt.spellCheckMode!="ieSpell") tb.addButton("btnSpellCheck"+oName, "btnSpellCheck.gif",getTxt("Check Spelling"));
          }
        break;
      case "StyleAndFormatting":
        if(oEdt.btnTextFormatting||oEdt.btnParagraphFormatting||oEdt.btnListFormatting||oEdt.btnBoxFormatting||oEdt.btnCssText||oEdt.btnCssBuilder) {
          tb.addDropdownButton("btnStyleAndFormat"+oName, "ddFormatting"+oName, "btnStyle.gif",getTxt("Styles & Formatting"));
          var ddFmt=new ISDropdown("ddFormatting"+oName);
          ddFmt.iconPath = tb.iconPath;
          ddFmt.onClick=function(id) {ddAction(tb, id, oEdt, oEdt.oName)};
          if(oEdt.btnTextFormatting) ddFmt.addItem("btnTextFormatting"+oName, getTxt("Text Formatting"), "btnTextFormatting.gif"); 
          if(oEdt.btnParagraphFormatting) ddFmt.addItem("btnParagraphFormatting"+oName, getTxt("Paragraph Formatting"), "btnParagraphFormatting.gif");
          if(oEdt.btnListFormatting) ddFmt.addItem("btnListFormatting"+oName, getTxt("List Formatting"), "btnListFormatting.gif");
          if(oEdt.btnBoxFormatting) ddFmt.addItem("btnBoxFormatting"+oName, getTxt("Box Formatting"), "btnBoxFormatting.gif");
          if(oEdt.btnCssText) ddFmt.addItem("btnCssText"+oName, getTxt("Custom CSS"), "btnCustomCss.gif");
          if(oEdt.btnCssBuilder) ddFmt.addItem("btnCssBuilder"+oName, getTxt("CSS Builder"));
        }
        break;
      case "Styles":
        if(oEdt.btnStyles)tb.addButton("btnStyles"+oName,"btnStyleSelect.gif",getTxt("Style Selection"));
        break;
      case "Paragraph":
        if(oEdt.btnParagraph)
          {
          tb.addDropdownButton("btnParagraph"+oName,"ddParagraph"+oName, "btnParagraph.gif",getTxt("Paragraph"), 37);
          var ddPar=new ISDropdown("ddParagraph"+oName);
          ddPar.onClick=function(id) {ddAction(tb, id, oEdt, oEdt.oName)};
          for(var j=0;j<oEdt.arrParagraph.length;j++)
            {
            ddPar.addItem("btnParagraph_"+j+oName, 
              "<"+oEdt.arrParagraph[j][1]+" style=\"\margin-bottom:4px\"  unselectable=on> "+
              oEdt.arrParagraph[j][0]+"</"+oEdt.arrParagraph[j][1]+">");
            }
          }
        break;
      case "FontName":
        if(oEdt.btnFontName)
          {
          tb.addDropdownButton("btnFontName"+oName,"ddFontName"+oName,"btnFontName.gif",getTxt("Font Name"),37);
          var ddFont=new ISDropdown("ddFontName"+oName);
          ddFont.onClick=function(id) {ddAction(tb, id, oEdt, oEdt.oName)};
          for(var j=0;j<oEdt.arrFontName.length;j++)
            {
            ddFont.addItem("btnFontName_"+j+oName, "<span style='font-family:"+oEdt.arrFontName[j]+"' unselectable=on>"+oEdt.arrFontName[j]+"</span><span unselectable=on style='font-family:tahoma'>("+ oEdt.arrFontName[j] +")</span>");
            }
          }
        break;
      case "FontSize":
        if(oEdt.btnFontSize)
          {
          tb.addDropdownButton("btnFontSize"+oName,"ddFontSize"+oName,"btnFontSize.gif",getTxt("Font Size"),37);
          var ddFs=new ISDropdown("ddFontSize"+oName);
          ddFs.onClick=function(id) {ddAction(tb, id, oEdt, oEdt.oName)};
          for(var j=0;j<oEdt.arrFontSize.length;j++)
            {
            ddFs.addItem("btnFontSize_"+j+oName, 
              "<font unselectable=on size=\""+oEdt.arrFontSize[j][1]+"\">"+
              oEdt.arrFontSize[j][0]+"</font>");
            }
          }
        break;
      case "Undo":
        if(oEdt.btnUndo)tb.addButton("btnUndo"+oName,"btnUndo.gif",getTxt("Undo"));
        break;
      case "Redo":
        if(oEdt.btnRedo)tb.addButton("btnRedo"+oName,"btnRedo.gif",getTxt("Redo"));
        break;
      
      case "Paste":
          if(oEdt.btnPasteWord || oEdt.btnPasteText) {
            tb.addDropdownButton("btnPaste"+oName, "ddPaste"+oName, "btnPaste.gif",getTxt("Paste"));
            var pvDD=new ISDropdown("ddPaste"+oName); 
            pvDD.iconPath = tb.iconPath;
            //pvDD.addItem("btnPasteClip"+oName, getTxt("Paste"), "btnPasteClip.gif");
            if(oEdt.btnPasteWord) pvDD.addItem("btnPasteWord"+oName, getTxt("Paste from Word"), "btnPasteWord.gif");
            if(oEdt.btnPasteText) pvDD.addItem("btnPasteText"+oName, getTxt("Paste Text"), "btnPasteText.gif");
            pvDD.onClick=function(id) {ddAction(tb, id, oEdt, oEdt.oName)};
          }
        break;
        
      //case "PasteWord":
      //  if(oEdt.btnPasteWord)tb.addButton("btnPasteWord"+oName,"btnPasteWord.gif",getTxt("Paste from Word"));
      //  break;
      //case "PasteText":
      //  if(oEdt.btnPasteText)tb.addButton("btnPasteText"+oName,"btnPasteText.gif",getTxt("Paste Text"));
      //  break;
      case "Bold":
        if(oEdt.btnBold)tb.addToggleButton("btnBold"+oName,"",false,"btnBold.gif",getTxt("Bold"));
        break;
      case "Italic":
        if(oEdt.btnItalic)tb.addToggleButton("btnItalic"+oName,"",false,"btnItalic.gif",getTxt("Italic"));
        break;
      case "Underline":
        if(oEdt.btnUnderline)tb.addToggleButton("btnUnderline"+oName,"",false,"btnUnderline.gif",getTxt("Underline"));
        break;
      case "Strikethrough":     
        if(oEdt.btnStrikethrough)tb.addToggleButton("btnStrikethrough"+oName,"",false,"btnStrikethrough.gif",getTxt("Strikethrough"));
        break;
      case "Superscript":
        if(oEdt.btnSuperscript)tb.addToggleButton("btnSuperscript"+oName,"",false,"btnSuperscript.gif",getTxt("Superscript"));
        break;
      case "Subscript":
        if(oEdt.btnSubscript)tb.addToggleButton("btnSubscript"+oName,"",false,"btnSubscript.gif",getTxt("Subscript"));
        break;
      case "JustifyLeft":
        if(oEdt.btnJustifyLeft)tb.addToggleButton("btnJustifyLeft"+oName,"align",false,"btnLeft.gif",getTxt("Justify Left"));
        break;
      case "JustifyCenter":
        if(oEdt.btnJustifyCenter)tb.addToggleButton("btnJustifyCenter"+oName,"align",false,"btnCenter.gif",getTxt("Justify Center"));
        break;
      case "JustifyRight":
        if(oEdt.btnJustifyRight)tb.addToggleButton("btnJustifyRight"+oName,"align",false,"btnRight.gif",getTxt("Justify Right"));
        break;
      case "JustifyFull":
        if(oEdt.btnJustifyFull)tb.addToggleButton("btnJustifyFull"+oName,"align",false,"btnFull.gif",getTxt("Justify Full"));
        break;
      case "Numbering":
        if(oEdt.btnNumbering)tb.addToggleButton("btnNumbering"+oName,"bullet",false,"btnNumber.gif",getTxt("Numbering"));
        break;
      case "Bullets":
        if(oEdt.btnBullets)tb.addToggleButton("btnBullets"+oName,"bullet",false,"btnList.gif",getTxt("Bullets"));
        break;
      case "Indent":
        if(oEdt.btnIndent)tb.addButton("btnIndent"+oName,"btnIndent.gif",getTxt("Indent"));
        break;
      case "Outdent":
        if(oEdt.btnOutdent)tb.addButton("btnOutdent"+oName,"btnOutdent.gif",getTxt("Outdent"));
        break;
      case "LTR":
        if(oEdt.btnLTR)tb.addToggleButton("btnLTR"+oName,"dir",false,"btnLTR.gif",getTxt("Left To Right"));
        break;
      case "RTL":
        if(oEdt.btnRTL)tb.addToggleButton("btnRTL"+oName,"dir",false,"btnRTL.gif",getTxt("Right To Left"));
        break;
      case "ForeColor":
        if(oEdt.btnForeColor)tb.addButton("btnForeColor"+oName,"btnForeColor.gif",getTxt("Foreground Color"));
        break;
      case "BackColor":
        if(oEdt.btnBackColor)tb.addButton("btnBackColor"+oName,"btnBackColor.gif",getTxt("Background Color"));
        break;
      case "Bookmark":
        if(oEdt.btnBookmark)tb.addButton("btnBookmark"+oName,"btnBookmark.gif",getTxt("Bookmark"));
        break;
      case "Hyperlink":
        if(oEdt.btnHyperlink)tb.addButton("btnHyperlink"+oName,"btnHyperlink.gif",getTxt("Hyperlink"));
        break;
      case "CustomTag":
        if(oEdt.btnCustomTag)
          {
          tb.addDropdownButton("btnCustomTag"+oName,"ddCustomTag"+oName,"btnCustomTag.gif",getTxt("Tags"),37);
          var ddCustomTag=new ISDropdown("ddCustomTag"+oName);
          ddCustomTag.onClick=function(id) {ddAction(tb, id, oEdt, oEdt.oName)};
          for(var j=0;j<oEdt.arrCustomTag.length;j++)
            {
              ddCustomTag.addItem("btnCustomTag_"+j+oName, oEdt.arrCustomTag[j][0]);
            }
          }
        break;
      case "Image":
        if(oEdt.btnImage)tb.addButton("btnImage"+oName,"btnImage.gif",getTxt("Image"));
        break;
      case "Flash":
        if(oEdt.btnFlash)tb.addButton("btnFlash"+oName,"btnFlash.gif",getTxt("Flash"));
        break;
      case "Media":
        if(oEdt.btnMedia)tb.addButton("btnMedia"+oName,"btnMedia.gif",getTxt("Media"));
        break;
        
      case "ContentBlock":
        if(oEdt.btnContentBlock)tb.addButton("btnContentBlock"+oName,"btnContentBlock.gif",getTxt("Content Block"));
        break;
      case "InternalLink":
        if(oEdt.btnInternalLink)tb.addButton("btnInternalLink"+oName,"btnInternalLink.gif",getTxt("Internal Link"));
        break;
      case "InternalImage":
        if(oEdt.btnInternalImage)tb.addButton("btnInternalImage"+oName,"btnInternalImage.gif",getTxt("Internal Image"));
        break;
      case "CustomObject":
        if(oEdt.btnCustomObject)tb.addButton("btnCustomObject"+oName,"btnCustomObject.gif",getTxt("Object"));
        break;
      case "Table":
        if(oEdt.btnTable)
          {
          var sdd=[], sZ=0;
          sdd[sZ++]="<table width='175' id='dropTableCreate"+oName+"' style='cursor:default;background:#f3f3f8;' cellpadding=0 cellspacing=1 unselectable=on>";
          for(var m=0;m<8;m++)
            {
            sdd[sZ++]="<tr>";
            for(var n=0;n<8;n++)
              {
              sdd[sZ++]="<td onclick='"+oName+".doClick_TabCreate(this)' onmouseover='doOver_TabCreate(this);event.cancelBubble=true;' style='background:#ffffff;font-size:1px;border:#d3d3d3 1px solid;width:20px;height:20px;' unselectable=on>&nbsp;</td>";
              }
            sdd[sZ++]="</tr>";
            }
          sdd[sZ++]="<tr><td colspan=8 onclick=\""+oName+".hide();modelessDialogShow('"+oEdt.scriptPath+"table_insert.htm',380,360);\" onmouseover=\"doOut_TabCreate(document.getElementById('dropTableCreate"+oName+"'));this.innerHTML='"+getTxt("Advanced Table Insert")+"';this.style.border='#777777 1px solid';this.style.backgroundColor='#444444';this.style.color='#ffffff'\" onmouseout=\"this.style.border='#f3f3f8 1px solid';this.style.backgroundColor='#f3f3f8';this.style.color='#000000'\" align=center style='font-family:verdana;font-size:10px;color:#000000;border:#f3f3f8 1px solid;padding:1px 1px 1px 1px' unselectable=on>"+getTxt("Advanced Table Insert")+"</td></tr>";
          sdd[sZ++]="</table>";
          
          tb.addDropdownButton("btnTable"+oName,"ddTable"+oName,"btnTable.gif",getTxt("Insert Table"));
          var ddTable=new ISDropdown("ddTable"+oName);
          ddTable.add(new ISCustomDDItem("btnInsertTable", sdd.join("")));
                    
          tb.addDropdownButton("btnTableEdit"+oName,"ddTableEdit"+oName,"btnTableEdit.gif",getTxt("Edit Table/Cell"));
          var ddTblEdit=new ISDropdown("ddTableEdit"+oName);
          ddTblEdit.iconPath = tb.iconPath;
          ddTblEdit.onClick=function(id) {ddAction(tb, id, oEdt, oEdt.oName)};
          ddTblEdit.addItem("mnuTableSize"+oName, getTxt("Table Size"), "btnTableSize.gif");
          ddTblEdit.addItem("mnuTableEdit"+oName, getTxt("Edit Table"), "btnEditTable.gif");
          ddTblEdit.addItem("mnuCellEdit"+oName, getTxt("Edit Cell"), "btnEditCell.gif");
          }
        break;
      case "Absolute":
        if(oEdt.btnAbsolute)tb.addButton("btnAbsolute"+oName,"btnAbsolute.gif",getTxt("Absolute"));
        break;
      case "Characters":
        if(oEdt.btnCharacters)tb.addButton("btnCharacters"+oName,"btnSymbol.gif",getTxt("Special Characters"));
        break;
      case "Line":
        if(oEdt.btnLine)tb.addButton("btnLine"+oName,"btnLine.gif",getTxt("Line"));
        break;
      case "Form":
        if(oEdt.btnForm)
          {
          var arrFormMenu = [[getTxt("Form"),"form_form.htm","280","177"],
            [getTxt("Text Field"),"form_text.htm","285","289"],
            [getTxt("List"),"form_list.htm","295","332"],
            [getTxt("Checkbox"),"form_check.htm","235","174"],
            [getTxt("Radio Button"),"form_radio.htm","235","177"],
            [getTxt("Hidden Field"),"form_hidden.htm","235","152"],
            [getTxt("File Field"),"form_file.htm","235","132"],
            [getTxt("Button"),"form_button.htm","235","174"]];
          
          tb.addDropdownButton("btnForm"+oName, "ddForm"+oName, "btnForm.gif",getTxt("Form Editor"));
          var ddForm=new ISDropdown("ddForm"+oName);
          ddForm.onClick=function(id) {ddAction(tb, id, oEdt, oEdt.oName)};
          for(var j=0;j<arrFormMenu.length;j++)
            {
              ddForm.addItem("btnForm"+j+oName, arrFormMenu[j][0]);
            }
          }
        break;

      case "RemoveFormat":
        if(oEdt.btnRemoveFormat)tb.addButton("btnRemoveFormat"+oName,"btnRemoveFormat.gif",getTxt("Remove Formatting"));
        break;
      case "HTMLFullSource":
        if(oEdt.btnHTMLFullSource)tb.addButton("btnHTMLFullSource"+oName,"btnSource.gif",getTxt("View/Edit Source"));
        break;
      case "HTMLSource":
        if(oEdt.btnHTMLSource)tb.addButton("btnHTMLSource"+oName,"btnSource.gif",getTxt("View/Edit Source"));
        break;
      case "XHTMLFullSource":
        if(oEdt.btnXHTMLFullSource)tb.addButton("btnXHTMLFullSource"+oName,"btnSource.gif",getTxt("View/Edit Source"));
        break;
      case "XHTMLSource":
        if(oEdt.btnXHTMLSource)tb.addButton("btnXHTMLSource"+oName,"btnSource.gif",getTxt("View/Edit Source"));
        break;
      case "ClearAll":
        if(oEdt.btnClearAll)tb.addButton("btnClearAll"+oName,"btnDelete.gif",getTxt("Clear All"));
        break;
      default:
        for(j=0;j<oEdt.arrCustomButtons.length;j++)
          {
          if(sButtonName==oEdt.arrCustomButtons[j][0])
            {
            sCbName=oEdt.arrCustomButtons[j][0];
            //sCbCommand=oEdt.arrCustomButtons[j][1];
            sCbCaption=oEdt.arrCustomButtons[j][2];
            sCbImage=oEdt.arrCustomButtons[j][3];
            if(oEdt.arrCustomButtons[j][4])
              tb.addButton(sCbName+oName,sCbImage,sCbCaption,oEdt.arrCustomButtons[j][4]);
            else
              tb.addButton(sCbName+oName,sCbImage,sCbCaption);
            }
          }
        break;
        
      }
    }
};


function iwe_getElm(s)
  {
  return document.getElementById(s+this.oName)
  };

/*** Replace current body onload ***/
function onload_new()
  { 
  onload_original();  
  //alert("setEdit here");
  //oUtil.setEdit();
  };
function onload_original()
  {
  };

/*** Color Picker Object ***/
var arrColorPickerObjects=[];
function ColorPicker(sName,sParent)
    {
    this.oParent=sParent;
    if(sParent)
        {
        this.oName=sParent+"."+sName;
        this.oRenderName=sName+sParent;
        }
    else
        {
        this.oName=sName;
        this.oRenderName=sName;
        }
    arrColorPickerObjects.push(this.oName);

    this.url="color_picker.htm";
    this.onShow=function(){return true;};
    this.onHide=function(){return true;};
    this.onPickColor=function(){return true;};
    this.onRemoveColor=function(){return true;};
    this.onMoreColor=function(){return true;};  
    this.show=showColorPicker;
    this.hide=hideColorPicker;
    this.hideAll=hideColorPickerAll;
    this.color;
    this.customColors=[];
    this.refreshCustomColor=refreshCustomColor;
    this.isActive=false;
    this.txtCustomColors="Custom Colors";
    this.txtMoreColors="More Colors...";
    this.align="left";
    this.currColor="#ffffff";//default current color
    this.generateHTML=generateHTML;
    this.RENDER=drawColorPicker;
    };
function generateHTML() 
  { 
    var arrColors=[["#800000","#8b4513","#006400","#2f4f4f","#000080","#4b0082","#800080","#000000"],
                ["#ff0000","#daa520","#6b8e23","#708090","#0000cd","#483d8b","#c71585","#696969"],
                ["#ff4500","#ffa500","#808000","#4682b4","#1e90ff","#9400d3","#ff1493","#a9a9a9"],
                ["#ff6347","#ffd700","#32cd32","#87ceeb","#00bfff","#9370db","#ff69b4","#dcdcdc"],
                ["#ffdab9","#ffffe0","#98fb98","#e0ffff","#87cefa","#e6e6fa","#dda0dd","#ffffff"]];
    var sHTMLColor="<table id=dropColor"+this.oRenderName+" style=\"z-index:1;display:none;position:absolute;border:#9b95a6 1px solid;cursor:default;background-color:#f4f4f4;padding:2px\" unselectable=on cellpadding=0 cellspacing=0 width=145px><tr><td unselectable=on style='padding:0px;'>";
    sHTMLColor+="<table align=center cellpadding=0 cellspacing=0 border=0 unselectable=on>";
    for(var i=0;i<arrColors.length;i++)
        {
        sHTMLColor+="<tr>";
        for(var j=0;j<arrColors[i].length;j++)
            sHTMLColor+="<td onclick=\""+this.oName+".color='"+arrColors[i][j]+"';"+this.oName+".onPickColor();"+this.oName+".currColor='"+arrColors[i][j]+"';"+this.oName+".hideAll()\" onmouseover=\"this.style.border='#777777 1px solid'\" onmouseout=\"this.style.border='#f4f4f4 1px solid'\" style=\"padding:0px;cursor:default;padding:1px;border:#f4f4f4 1px solid;\" unselectable=on>"+
                "<table style='margin:0px;width:13px;height:13px;background:"+arrColors[i][j]+";border:white 1px solid' cellpadding=0 cellspacing=0 unselectable=on>"+
                "<tr><td unselectable=on style='padding:0px;'></td></tr>"+
                "</table></td>";
        sHTMLColor+="</tr>";        
        }
    
    //~~~ custom colors ~~~~
    sHTMLColor+="<tr><td colspan=8 id=idCustomColor"+this.oRenderName+" style='padding:0px;'></td></tr>";
    
    //~~~ remove color & more colors ~~~~
    sHTMLColor+= "<tr>";
    sHTMLColor+= "<td unselectable=on style='padding:0px;'>"+
        "<table style='padding:0px;margin-left:1px;width:14px;height:14px;background:#f4f4f4;' cellpadding=0 cellspacing=0 unselectable=on>"+
        "<tr><td onclick=\""+this.oName+".onRemoveColor();"+this.oName+".currColor='';"+this.oName+".hideAll()\" onmouseover=\"this.style.border='#777777 1px solid'\" onmouseout=\"this.style.border='white 1px solid'\" style=\"cursor:default;padding:1px;border:white 1px solid;font-family:verdana;font-size:10px;color:#000000;line-height:9px;\" align=center valign=top unselectable=on>x</td></tr>"+
        "</table></td>";
    sHTMLColor+= "<td colspan=7 unselectable=on style='padding:0px;'>"+
        "<table style='padding:0px;margin:1px;width:117px;height:16px;background:#f4f4f4;border:white 1px solid' cellpadding=0 cellspacing=0 unselectable=on>"+
        "<tr><td id=\""+this.oName+"moreColTd\" onclick=\""+this.oName+".onMoreColor();"+this.oName+".hideAll();modelessDialogShow('"+this.url+"?" +this.oName+ "', 444, 430, window,{'oName':'"+this.oName+"'})\" onmouseover=\"this.style.border='#777777 1px solid';this.style.background='#444444';this.style.color='#ffffff'\" onmouseout=\"this.style.border='#f4f4f4 1px solid';this.style.background='#f4f4f4';this.style.color='#000000'\" style=\"cursor:default;font-family:verdana;font-size:9px;color:#000000;line-height:9px;padding:1px\" align=center valign=top nowrap unselectable=on>"+this.txtMoreColors+"</td></tr>"+
        "</table></td>";
    sHTMLColor+= "</tr>";
    
    sHTMLColor+= "</table>";            
    sHTMLColor+="</td></tr></table>";
    return sHTMLColor;
  };
function drawColorPicker()
    {   
    document.write(this.generateHTML());
    };    
function refreshCustomColor()
    {
    this.customColors=eval(this.oParent).customColors;//[CUSTOM] (Get from public definition)
    
    if(this.customColors.length==0)
        {
        document.getElementById("idCustomColor"+this.oRenderName).innerHTML="";
        return;
        }
    sHTML="<table cellpadding=0 cellspacing=0 width=100%><tr><td colspan=8 style=\"font-family:verdana;font-size:9px;color:#000000;line-height:9px;padding:1px\">"+this.txtCustomColors+":</td></tr></table>";
    sHTML+="<table cellpadding=0 cellspacing=0><tr>";   
    for(var i=0;i<this.customColors.length;i++)
        {
        if(i<22)
            {
            if(i==8||i==16||i==24||i==32)sHTML+="</tr></table><table cellpadding=0 cellspacing=0><tr>";
            sHTML+="<td onclick=\""+this.oName+".color='"+this.customColors[i]+"';"+this.oName+".onPickColor()\" onmouseover=\"this.style.border='#777777 1px solid'\" onmouseout=\"this.style.border='#f4f4f4 1px solid'\" style=\"cursor:default;padding:1px;border:#f4f4f4 1px solid;\" unselectable=on>"+
                "   <table  style='margin:0px;width:13px;height:13px;background:"+this.customColors[i]+";border:white 1px solid' cellpadding=0 cellspacing=0 unselectable=on>"+
                "   <tr><td unselectable=on></td></tr>"+
                "   </table>"+
                "</td>";
            }           
        }
    sHTML+="</tr></table>";
    document.getElementById("idCustomColor"+this.oRenderName).innerHTML=sHTML;
    };    
function showColorPicker(oEl)
    {
    this.onShow();
    
    this.hideAll();

    var box=document.getElementById("dropColor"+this.oRenderName);

    //remove hilite
    var allTds = box.getElementsByTagName("TD");
    for (var i = 0; i<allTds.length; i++) 
    {
        allTds[i].style.border="#f4f4f4 1px solid";
        if (allTds[i].id==this.oName+"moreColTd") 
      {
      allTds[i].style.border="#f4f4f4 1px solid";
      allTds[i].style.background="#f4f4f4";
      allTds[i].style.color="#000000";
      }
    }

    box.style.display="block";
    var nTop=0;
    var nLeft=0;

    oElTmp=oEl;
    while(oElTmp.tagName!="BODY" && oElTmp.tagName!="HTML")
        {
        nTop+=oElTmp.offsetTop;
        oElTmp = oElTmp.offsetParent;
        }

    oElTmp=oEl;
    while(oElTmp.tagName!="BODY" && oElTmp.tagName!="HTML")
        {
        nLeft+=oElTmp.offsetLeft;
        oElTmp=oElTmp.offsetParent;
        }
    
    
    //if scroll.
    var scrX = document.body.scrollLeft || document.documentElement.scrollLeft;
    var scrY = document.body.scrollTop || document.documentElement.scrollTop;
    
    if(this.align=="left")
        box.style.left=(nLeft+oUtil.obj.dropLeftAdjustment_moz)+"px";
    else//right
        box.style.left=(nLeft-143+oEl.offsetWidth+oUtil.obj.dropLeftAdjustment_moz)+"px";
        
    box.style.top=(nTop+iconHeight+1+oUtil.obj.dropTopAdjustment_moz)+"px";//[CUSTOM]
    
    box.style.zIndex=1000000;
    
    this.isActive=true;
    
    this.refreshCustomColor();
    };
function hideColorPicker()
    {
    this.onHide();
    
    var box=document.getElementById("dropColor"+this.oRenderName);
    box.style.display="none";
    this.isActive=false;
    };    
function hideColorPickerAll()
    {
    for(var i=0;i<arrColorPickerObjects.length;i++)
        {
        var box=document.getElementById("dropColor"+eval(arrColorPickerObjects[i]).oRenderName);
        box.style.display="none";
        eval(arrColorPickerObjects[i]).isActive=false;
        }
    };

/*** CONTENT ***/
function loadHTML(sHTML)//hanya utk first load.
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oDoc=oEditor.document.open("text/html");
    
    if(this.publishingPath!="")
        {
        var arrA = String(this.preloadHTML).match(/<base[^>]*>/ig);
        if(!arrA)
            {//if no <base> found
            sHTML=this.docType+"<html><head><base href=\""+this.publishingPath+"\"/>"+this.headContent+"</head><body>" + sHTML + "</body></html>";
            //kalau cuma tambah <HTML><HEAD></HEAD><BODY.. tdk apa2.
            }
        }
    else
        {
        sHTML=this.docType+"<html><head>"+this.headContent+"</head><body>"+sHTML+"</body></html>";
        }
    oDoc.write(sHTML);
    oDoc.close();

    //RealTime
    
    var me=this;
    oEditor.document.addEventListener("keyup", new Function("editorDoc_onkeyup("+this.oName+")"), true);
    oEditor.document.addEventListener("mouseup", function(e) {editorDoc_onmouseup(e, me.oName);}, true);
    oEditor.document.addEventListener("keydown", new Function("var e=arguments[0];doKeyPress(eval(e), "+this.oName+")"), false);

    /*** Apply this.arrStyle to the content ***/
    if(this.arrStyle.length>0)
        {
        var oElement=oEditor.document.createElement("STYLE");
        oEditor.document.documentElement.childNodes[0].appendChild(oElement);
        var sCssText = "";
        for(var i=0;i<this.arrStyle.length;i++)
            {
            selector=this.arrStyle[i][0];
            style=this.arrStyle[i][3];
            sCssText += selector + " { " + style + " } ";    
            }
        oElement.appendChild(oEditor.document.createTextNode(sCssText));
        }
    
    var objL = oEditor.document.createElement("LINK");
    objL.href=this.scriptPath+"default_edit.css";
    objL.rel="StyleSheet";
    objL.id="tmp_xxinnova";
    oEditor.document.documentElement.childNodes[0].appendChild(objL);
    
    if(this.css!="") {
      objL = oEditor.document.createElement("LINK");
      objL.href=this.css;
      objL.rel="StyleSheet";
      oEditor.document.documentElement.childNodes[0].appendChild(objL);
    }
    
    this.cleanDeprecated();
    };

function loadHTMLFull(sHTML, firstLoad)//first load full HTML
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;

    //save doctype (if any/if not body only)
    var arrA=String(sHTML).match(/<!DOCTYPE[^>]*>/ig);
    if(arrA)
        for(var i=0;i<arrA.length;i++)
            {
            this.docType=arrA[i];
            }
    else this.docType="";//back to default value

    //save html (if any/if not body only)
    var arrB=String(sHTML).match(/<HTML[^>]*>/ig);
    if(arrB)
        for(var i=0;i<arrB.length;i++)
            {
            s=arrB[i];
            s=s.replace(/\"[^\"]*\"/ig,function(x){
                        x=x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/\s+/ig,"#_#");
                        return x});
            s=s.replace(/<([^ >]*)/ig,function(x){return x.toLowerCase()});
            s=s.replace(/ ([^=]+)=([^" >]+)/ig," $1=\"$2\"");
            s=s.replace(/ ([^=]+)=/ig,function(x){return x.toLowerCase()});
            s=s.replace(/#_#/ig," ");
            this.html=s;
            }
    else this.html="<html>";//back to default value

    //Dalam pengeditan kalau pakai doctype,
    //membuat mouse tdk bisa di-klik di empty area
    //sHTML=String(sHTML).replace(/<!DOCTYPE[^>]*>/ig,"");
    if(this.publishingPath!="")
        {
        var arrA = sHTML.match(/<base[^>]*>/ig);
        if(!arrA)
            {
            sHTML="<BASE HREF=\""+this.publishingPath+"\"/>"+sHTML;
            }
        }

    if (firstLoad) {
      try {oEditor.document.designMode="on";} catch(e) {}
    }
    
    var de = oEditor.document.documentElement;
    
    var reg = /<head>([\S\s]*?)<\/head>/gi;
    var res = reg.exec(sHTML), hcnt = "";
    if(res) hcnt = res[1];
    
    if(hcnt.indexOf("default_edit.css")==-1) {
      hcnt=hcnt+"<link id='tmp_xxinnova' rel='stylesheet' href='" + this.scriptPath+"default_edit.css" + "' />";
    }    
    
    sHTML = sHTML.replace(reg, "<head>"+hcnt+"</head>");
    
    var oDoc=oEditor.document.open("text/html","replace");
    oDoc.write(sHTML);
    oDoc.close();
    
    //RealTime
    var me=this;
    oEditor.document.addEventListener("keyup", new Function("editorDoc_onkeyup("+me.oName+")"), true);
    oEditor.document.addEventListener("mouseup", function(e) {editorDoc_onmouseup(e, me.oName);}, true);
    oEditor.document.addEventListener("keydown", new Function("var e=arguments[0];doKeyPress(eval(e), "+this.oName+")"), false);

    this.cleanDeprecated();
    }

function putHTML(sHTML) 
  {//used by source editor
  this.loadHTMLFull(sHTML, true);
  };

function encodeHTMLCode(sHTML) {
  return sHTML.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
};

function cleanHTML(sHTML) {
  var h = sHTML.replace(/<br class="innova" \/>/gi, "").replace(/<br class="innova">/gi, "");
  
  //clean internal editing css
  var sMatch=h.match(/<link[^>]*>/ig);
  if(sMatch) {
    for(var i=0; i < sMatch.length; i++) {
      if(sMatch[i].indexOf("tmp_xxinnova") != -1) {
        h = h.replace(new RegExp(sMatch[i], "gi"), "");
      }
    }
  }  
  return h;
};

function getTextBody()
  {
  var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
  var sText = oEditor.document.body.textContent;
  sText = sText.replace(/<!(?:--[\s\S]*?--\s*)?>\s*/gi, "");
  return sText;
  };
function getHTML()
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    this.cleanDeprecated();

    sHTML=getOuterHTML(oEditor.document.documentElement);
    sHTML=String(sHTML).replace(/ contentEditable=true/gi,"");
    sHTML=this.docType+sHTML;//restore doctype (if any)
    sHTML=oUtil.replaceSpecialChar(sHTML);
    if(this.encodeIO) sHTML=encodeHTMLCode(sHTML);
    sHTML = cleanHTML(sHTML);
    return sHTML;
    };
function getHTMLBody()
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    this.cleanDeprecated();

    sHTML=oEditor.document.body.innerHTML;
    sHTML=String(sHTML).replace(/ contentEditable=true/gi,"");
    sHTML=oUtil.replaceSpecialChar(sHTML);
    if(this.encodeIO) sHTML=encodeHTMLCode(sHTML);
    sHTML = cleanHTML(sHTML);
    return sHTML;
    };
var sBaseHREF="";
function getXHTML()
  {
  var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
  this.cleanDeprecated();
  
  //base handling
  sHTML=getOuterHTML(oEditor.document.documentElement);
  var arrTmp=sHTML.match(/<BASE([^>]*)>/ig);
  if(arrTmp!=null)sBaseHREF=arrTmp[0];
  var arrBase = oEditor.document.getElementsByTagName("BASE");
  if (arrBase.length != null) 
    {
    for(var i=0; i<arrBase.length; i++) 
      {
      arrBase[i].parentNode.removeChild(arrBase[i]);
      }
    }
    
  //~~~~~~~~~~~~~
  sBaseHREF=sBaseHREF.replace(/<([^ >]*)/ig,function(x){return x.toLowerCase()});               
  sBaseHREF=sBaseHREF.replace(/ [^=]+="[^"]+"/ig,function(x){
    x=x.replace(/\s+/ig,"#_#");
    x=x.replace(/^#_#/," ");
    return x});
  sBaseHREF=sBaseHREF.replace(/ ([^=]+)=([^" >]+)/ig," $1=\"$2\"");
  sBaseHREF=sBaseHREF.replace(/ ([^=]+)=/ig,function(x){return x.toLowerCase()});
  sBaseHREF=sBaseHREF.replace(/#_#/ig," "); 

  sBaseHREF=sBaseHREF.replace(/>$/ig," \/>").replace(/\/ \/>$/ig,"\/>");
  //~~~~~~~~~~~~~

  sHTML=recur(oEditor.document.documentElement,"");

  sHTML=this.docType+this.html+sHTML+"\n</html>";//restore doctype (if any) & html
  sHTML=sHTML.replace(/<head>/i,"<head>"+sBaseHREF);//restore base href  
  sHTML=oUtil.replaceSpecialChar(sHTML);
  if(this.encodeIO) sHTML=encodeHTMLCode(sHTML);
  sHTML = cleanHTML(sHTML);
  return sHTML;
  };
function getXHTMLBody()
  {
  var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
  this.cleanDeprecated();

  //base handling
  sHTML=getOuterHTML(oEditor.document.documentElement);
  var arrTmp=sHTML.match(/<BASE([^>]*)>/ig);
  if(arrTmp!=null)sBaseHREF=arrTmp[0];
  var arrBase = oEditor.document.getElementsByTagName("BASE");
  if (arrBase.length != null) 
    {
    for(var i=0; i<arrBase.length; i++) 
      {
      arrBase[i].parentNode.removeChild(arrBase[i]);
      }
    }
  //~~~~~~~~~~~~~

  sHTML=recur(oEditor.document.body,"");
  sHTML=oUtil.replaceSpecialChar(sHTML);
  if(this.encodeIO) sHTML=encodeHTMLCode(sHTML);
  sHTML = cleanHTML(sHTML);
  return sHTML;
  };
function ApplyCSS(oName)
  {
    var sTmp="";
    var myStyle=document.getElementById("myStyle"+oName).contentWindow;
    for(var i=0;i<myStyle.document.styleSheets[0].cssRules.length;i++)
        {
        var sSelector=myStyle.document.styleSheets[0].cssRules[i].selectorText;
        if(sSelector!=undefined)
      {
      sCssText=myStyle.document.styleSheets[0].cssRules[i].style.cssText.replace(/"/g,"&quot;");
      var itemCount = sSelector.split(".").length;
      if(itemCount>1) 
        {
        sCaption=sSelector.split(".")[1];
        sTmp+=",[\""+sSelector+"\",true,\""+sCaption+"\",\""+ sCssText + "\"]";
        }
      else sTmp+=",[\""+sSelector+"\",false,\"\",\""+ sCssText + "\"]";
      }
        }
    var arrStyle = eval("["+sTmp.substr(1)+"]");

    if(arrStyle.length>0)
        {
        var oEditor=document.getElementById("idContent"+oName).contentWindow;
        var oElement=oEditor.document.createElement("STYLE");
        //oElement.id="idExtCss"
        oEditor.document.documentElement.childNodes[0].appendChild(oElement);
        var sCssText = "";
        for(var i=0;i<arrStyle.length;i++)
            {
            selector=arrStyle[i][0];
            style=arrStyle[i][3].replace(/&quot;/g,"\"");
            sCssText += selector + " { " + style + " } ";    
            }
        oElement.appendChild(oEditor.document.createTextNode(sCssText));        
        }
  };
function ApplyExternalStyle(oName)
    {
  var oEditor=document.getElementById("idContent"+oName).contentWindow;
  var sTmp="";
  for(var j=0;j<oEditor.document.styleSheets.length;j++)
    {
    var myStyle=oEditor.document.styleSheets[j];

    //In full HTML editing: this will parse linked & embedded stylesheet
    //In Body content editing: this will parse all embedded/applied css & arrStyle.
    for(var i=0;i<myStyle.cssRules.length;i++)
      {
      sSelector=myStyle.cssRules[i].selectorText;
      if(sSelector!=undefined)
        {
        sCssText=myStyle.cssRules[i].style.cssText.replace(/"/g,"&quot;");
        var itemCount = sSelector.split(".").length;
        if(itemCount>1) 
          {
          sCaption=sSelector.split(".")[1];
          sTmp+=",[\""+sSelector+"\",true,\""+sCaption+"\",\""+ sCssText + "\"]";
          }
        else sTmp+=",[\""+sSelector+"\",false,\"\",\""+ sCssText + "\"]";
        }
      }
    }
  
  var arrStyle = eval("["+sTmp.substr(1)+"]");
  var edtObj = eval(oName);  
  for(var i=0; i<arrStyle.length; i++) {
    for(var j=0; j<edtObj.arrStyle.length; j++) {      
      if(arrStyle[i][0].toLowerCase()==edtObj.arrStyle[j][0].toLowerCase()) {
        arrStyle[i][1]=edtObj.arrStyle[j][1];
        break;
      }
    }
  }
  
  edtObj.arrStyle=arrStyle;//Update arrStyle property
    };

function doApplyStyle(oName,sClassName)
  {
    var oEditor=document.getElementById("idContent"+oName).contentWindow;
    var oSel=oEditor.getSelection();
    eval(oName).saveForUndo();
  
  var element;
    if(oUtil.activeElement)
        {
        element=oUtil.activeElement;
        element.className=sClassName;
        }
    else
    { 
    element = getSelectedElement(oSel);
    if (isTextSelected(oSel)) 
      {
      if(oSel!="")
        {
        /*
        var idNewSpan=eval(oName).applySpan();
        if(idNewSpan)idNewSpan.className=sClassName;
        else
          {
          oElement.className=sClassName;
          }
        */
        eval(oName).applySpanStyle([],sClassName);
        }
      else
        {
        if(element.tagName=="BODY")return;
        element.className=sClassName;
        }
      }
    else
      {
      if(element.tagName=="BODY")return;
      element.className=sClassName;
      }
    }
  realTime(eval(oName));
  };

function openStyleSelect()
  {
  if(!this.isCssLoaded)ApplyExternalStyle(this.oName);
  this.isCssLoaded=true;//make only 1 call to ApplyExternalStyle()

  var idStyles=document.getElementById("idStyles"+this.oName);
  if(idStyles.innerHTML!="")
    {//toggle
    if(idStyles.style.display=="")
      idStyles.style.display="none";
    else
      idStyles.style.display="";
    return;
    }
  idStyles.style.display="";

  var h=document.getElementById("idContent"+this.oName).offsetHeight-27;
  
  var arrStyle=this.arrStyle;
  
  var sHTML="";
  sHTML+="<div unselectable=on style='margin:5px;margin-top:0;margin-right:0' align=right>";
  
  sHTML+="<table style='margin:1px;margin-top:2px;margin-bottom:3px;width:14px;height:14px;background:#E9E8F2;' cellpadding=0 cellspacing=0 unselectable=on>"+
    "<tr><td onclick=\""+this.oName+".openStyleSelect();\" onmouseover=\"this.style.border='#708090 1px solid';this.style.color='white';this.style.backgroundColor='9FA7BB'\" onmouseout=\"this.style.border='white 1px solid';this.style.color='black';this.style.backgroundColor=''\" style=\"cursor:default;padding:1px;border:white 1px solid;font-family:verdana;font-size:10px;color:#000000;line-height:9px;\" align=center valign=top unselectable=on>x</td></tr>"+
    "</table>";

  var sBody="";
  for(var i=0;i<arrStyle.length;i++)
    {
    sSelector=arrStyle[i][0];
    if(sSelector=="body")sBody=arrStyle[i][3];
    }

  sHTML+="<div unselectable=on style='overflow:auto;width:200px;height:"+h+"px;'>";
  sHTML+="<table name='tblStyles"+this.oName+"' id='tblStyles"+this.oName+"' cellpadding=0 cellspacing=0 style='background:#fcfcfc;"+sBody+";height:100%;width:100%;margin:0;'>";
  
  for(var i=0;i<arrStyle.length;i++)
    {
    sSelector=arrStyle[i][0];
    isOnSelection=arrStyle[i][1];
    
    sCssText=arrStyle[i][3];
    //sCssText=sCssText.replace(/color: rgb\(255, 255, 255\)/,"COLOR: #000000");

    sCaption=arrStyle[i][2];
    if(isOnSelection)
      {
      if(sSelector.split(".").length>1)//sudah pasti
        {
        var tmpSelector = sSelector;
        if (sSelector.indexOf(":")>0) tmpSelector = sSelector.substring(0, sSelector.indexOf(":"));
        sHTML+="<tr style=\"cursor:default\" onmouseover=\"if(this.style.marginRight!='1px'){this.style.background='"+this.styleSelectionHoverBg+"';this.style.color='"+this.styleSelectionHoverFg+"'}\" onmouseout=\"if(this.style.marginRight!='1px'){this.style.background='';this.style.color=''}\">";
        sHTML+="<td unselectable=on onclick=\"doApplyStyle('"+this.oName+"','"+tmpSelector.split(".")[1]+"')\" style='padding:2px'>";
        if(sSelector.split(".")[0]=="")
          sHTML+="<span unselectable=on style=\""+sCssText+";margin:0;\">"+sCaption+"</span>";
        else
          sHTML+="<span unselectable=on style=\""+sCssText+";margin:0;\">"+sSelector+"</span>";
        sHTML+="</td></tr>";
        }
      }
    }
  sHTML+="<tr><td height=100%>&nbsp;</td></tr></table></div>";
  sHTML+="</div>";
  document.getElementById("idStyles"+this.oName).innerHTML=sHTML;
  };

/**************************
  NEW SPAN OPERATION 
**************************/

/*** CLEAN ***/
function cleanFonts() 
  {
  var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
  var allFonts = oEditor.document.body.getElementsByTagName("FONT");
  if(allFonts.length==0)return false;
  
  var f; var range;
  while (allFonts.length>0) 
    {
    f = allFonts[0];
    if (f.hasChildNodes && f.childNodes.length==1 && f.childNodes[0].nodeType==1 && f.childNodes[0].nodeName=="SPAN") 
      {
      //if font containts only span child node
      
      var theSpan = f.childNodes[0];
      copyAttribute(theSpan, f);
      
      range = oEditor.document.createRange();
      range.selectNode(f);
      range.insertNode(theSpan);
      range.selectNode(f);
      range.deleteContents();
      } 
    else 
      if (f.parentNode.nodeName=="SPAN" && f.parentNode.childNodes.length==1) 
        {
        //font is the only child node of span.
        var theSpan = f.parentNode;
        copyAttribute(theSpan, f);
        theSpan.innerHTML = f.innerHTML;
        } 
      else 
        {
        var newSpan = oEditor.document.createElement("SPAN");
        copyAttribute(newSpan, f);
        newSpan.innerHTML = f.innerHTML;
        f.parentNode.replaceChild(newSpan, f);
        }
    }
  return true;
  };
function cleanTags(elements,sVal)
  {
  var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
  if(elements.length==0)return false;
  
  var f;var range;
  while(elements.length>0) 
    {
    f = elements[0];
    if(f.hasChildNodes && f.childNodes.length==1 && f.childNodes[0].nodeType==1 && f.childNodes[0].nodeName=="SPAN") 
      {//if font containts only span child node      
      var theSpan=f.childNodes[0];
      if(sVal=="bold")theSpan.style.fontWeight="bold";
      if(sVal=="italic")theSpan.style.fontStyle="italic";
      if(sVal=="line-through")theSpan.style.textDecoration="line-through";
      if(sVal=="underline")theSpan.style.textDecoration="underline";

      range=oEditor.document.createRange();
      range.selectNode(f);
      range.insertNode(theSpan);
      range.selectNode(f);
      range.deleteContents();
      } 
    else 
      if (f.parentNode.nodeName=="SPAN" && f.parentNode.childNodes.length==1) 
        {
        //font is the only child node of span.
        var theSpan=f.parentNode;
        if(sVal=="bold")theSpan.style.fontWeight="bold";
        if(sVal=="italic")theSpan.style.fontStyle="italic";
        if(sVal=="line-through")theSpan.style.textDecoration="line-through";
        if(sVal=="underline")theSpan.style.textDecoration="underline";
        
        theSpan.innerHTML=f.innerHTML;
        } 
      else 
        {
        var newSpan = oEditor.document.createElement("SPAN");
        if(sVal=="bold")newSpan.style.fontWeight="bold";
        if(sVal=="italic")newSpan.style.fontStyle="italic";
        if(sVal=="line-through")newSpan.style.textDecoration="line-through";
        if(sVal=="underline")newSpan.style.textDecoration="underline";

        newSpan.innerHTML=f.innerHTML;
        f.parentNode.replaceChild(newSpan,f);
        }
    }
  return true;
  };
function replaceTags(sFrom,sTo)
  {
  var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
  
  var elements=oEditor.document.body.getElementsByTagName(sFrom);
  
  while(elements.length>0) 
    {
    f = elements[0];
    
    var newSpan = oEditor.document.createElement(sTo);
    newSpan.innerHTML=f.innerHTML;
    f.parentNode.replaceChild(newSpan,f);
    }
  };
/************************************
  Used in loadHTML, loadHTMLFull, 
  doKeyPress,
  getHTML, getXHTML, 
  getHTMLBody, getXHTMLBody,
  pasteWord.htm,
  source_html.htm, source_xhtml.htm
*************************************/
function cleanDeprecated()
  {
  var oEditor=document.getElementById("idContent"+this.oName).contentWindow;

  var elements;

  elements=oEditor.document.body.getElementsByTagName("STRONG");
  this.cleanTags(elements,"bold");
  elements=oEditor.document.body.getElementsByTagName("B");
  this.cleanTags(elements,"bold");

  elements=oEditor.document.body.getElementsByTagName("I");
  this.cleanTags(elements,"italic");
  elements=oEditor.document.body.getElementsByTagName("EM");
  this.cleanTags(elements,"italic");
  
  elements=oEditor.document.body.getElementsByTagName("STRIKE");
  this.cleanTags(elements,"line-through");
  elements=oEditor.document.body.getElementsByTagName("S");
  this.cleanTags(elements,"line-through");
  
  elements=oEditor.document.body.getElementsByTagName("U");
  this.cleanTags(elements,"underline");

  this.replaceTags("DIR","DIV");
  this.replaceTags("MENU","DIV"); 
  this.replaceTags("CENTER","DIV");
  this.replaceTags("XMP","PRE");
  this.replaceTags("BASEFONT","SPAN");//will be removed by cleanEmptySpan()
  
  elements=oEditor.document.body.getElementsByTagName("APPLET");
  while(elements.length>0) 
    {
    var f = elements[0];
    theParent = f.parentNode;
    theParent.removeChild(f);
    }
  
  this.cleanFonts();
  this.cleanEmptySpan();

  return true;
  };

/*** APPLY ***/
function applySpanStyle(arrStyles,sClassName, blockTag)
  {
  var useBlock = "SPAN";
  if (blockTag!=null && blockTag!="") useBlock = blockTag;

  var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
  var oSel=oEditor.getSelection();

  var range;
  var oElement;
  if (!isTextSelected(oSel)) 
    { //if not text selection
    range = oSel.getRangeAt(0);
    oElement = getSelectedElement(oSel);
    if(oElement.nodeName==useBlock) return oElement;
    return;
    }

  this.hide();
  this.doCmd("fontsize","0");

  replaceWithSpan(oEditor,arrStyles,sClassName, useBlock);
  realTime(this);  
  };
function doClean()
    {
    this.saveForUndo();//Save for Undo

    if(oUtil.activeElement) var element=oUtil.activeElement;
    else
        {
        var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
        var oSel=oEditor.getSelection();        
    element = getSelectedElement(oSel);
    if(isTextSelected(oSel)) 
      {
      if(oSel!="")
        {
        var range = oSel.getRangeAt(0);
        if(element.innerHTML!=range.toString())
          {
          this.doCmd('RemoveFormat');
          realTime(this);
          return;
          }
        }
      else
        {
        if(element.tagName=="BODY")return;
        }
      }
    else
      {
      if(element.tagName=="BODY")return;
      }
        }
        
  element.removeAttribute("className");
  element.removeAttribute("style");

  if(element.tagName=="H1"||
    element.tagName=="H2"||
    element.tagName=="H3"||
    element.tagName=="H4"||
    element.tagName=="H5"||
    element.tagName=="H6"||
    element.tagName=="PRE"||
    element.tagName=="P"||
    element.tagName=="DIV")
    {
    this.doCmd('FormatBlock','<P>');
    } 

    this.doCmd('RemoveFormat');
    realTime(this);
    };

function cleanEmptySpan()
  {
  var bReturn=false;
  var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
  var reg = /<\s*SPAN\s*>/gi;

  while (true) 
    {
    var allSpans = oEditor.document.getElementsByTagName("SPAN");
    if(allSpans.length==0) break;

    var emptySpans = []; 
    for (var i=0; i<allSpans.length; i++) 
      {
      if (getOuterHTML(allSpans[i]).search(reg) == 0)
        emptySpans[emptySpans.length]=allSpans[i];
      }
    if (emptySpans.length == 0) break;
    var theSpan, theParent;
    for (var i=0; i<emptySpans.length; i++) 
      {
      theSpan = emptySpans[i];
      theParent = theSpan.parentNode;
      if (!theParent) continue;
      if (theSpan.hasChildNodes()) 
        {
        var range = oEditor.document.createRange();
        range.selectNodeContents(theSpan);
        var docFrag = range.extractContents();
        theParent.replaceChild(docFrag, theSpan);
        } 
      else 
        {
        theParent.removeChild(theSpan);
        }
      bReturn=true;
      }
    }
  return bReturn;
  };

/*** COMMON ***/
function copyStyleClass(newSpan,arrStyles,sClassName) 
  {
  if(arrStyles)
    {
    for(var i=0;i<arrStyles.length;i++) 
      {
        //eval("newSpan.style."+arrStyles[i][0]+"=\""+arrStyles[i][1]+"\"");
        newSpan.style[arrStyles[i][0]]=arrStyles[i][1];
      }
    if(newSpan.style.cssText=="")newSpan.removeAttribute("style",0);
    }
  if(sClassName)
    newSpan.className=sClassName;
  };

function copyAttribute(newSpan,f) 
  {
  if ((f.face != null) && (f.face != ""))newSpan.style.fontFamily=f.face;
  if ((f.size != null) && (f.size != ""))
    {
    var nSize="";
    if(f.size==1)nSize="8pt";
    else if(f.size==2)nSize="10pt";
    else if(f.size==3)nSize="12pt";
    else if(f.size==4)nSize="14pt";
    else if(f.size==5)nSize="18pt";
    else if(f.size==6)nSize="24pt";
    else if(f.size>=7)nSize="36pt";
    else if(f.size<=-2||f.size=="0")nSize="8pt";
    else if(f.size=="-1")nSize="10pt";
    else if(f.size==0)nSize="12pt";
    else if(f.size=="+1")nSize="14pt";
    else if(f.size=="+2")nSize="18pt";
    else if(f.size=="+3")nSize="24pt";
    else if(f.size=="+4"||f.size=="+5"||f.size=="+6")nSize="36pt";
    else nSize="";
    if(nSize!="")newSpan.style.fontSize=nSize;
    }
  if ((f.style.backgroundColor != null)&&(f.style.backgroundColor != ""))newSpan.style.backgroundColor=f.style.backgroundColor;
  if ((f.color != null)&&(f.color != ""))newSpan.style.color=f.color;
  if((f.className!=null)&&(f.className!=""))newSpan.className=f.className;
  };
  
function replaceWithSpan(oEditor, arrStyles, sClassName, blockTag)
  {
  var useBlock = "SPAN";
  if (blockTag!=null && blockTag!="") useBlock = blockTag;

  var oSel = oEditor.getSelection();

  //mark selection start font and selection end font.
  var range = oSel.getRangeAt(0);
  var startFont = GetElement(range.startContainer, "FONT");
  if (startFont == null) startFont = range.startContainer.nextSibling;
  startFont.setAttribute("startcont", "this");

  var endFont = GetElement(range.endContainer, "FONT");
  if (endFont == null) endFont = range.endContainer.prevSibling;
  if (endFont != null) endFont.setAttribute("endcont", "this");

  var startCont = range.startContainer;
  var endCont = range.endContainer;

  //assume, FONT tag are created when applying font size command
  var allFonts = oEditor.document.getElementsByTagName("FONT");
  var newSpan = null;
  var f = null;
  while(allFonts.length > 0) 
    {
    f = allFonts[0];      
    //if a font tag have only 1 child nodes and the child nodes is SPAN, then remove the font tag
    if (f.childNodes && f.childNodes.length==1 && f.childNodes[0].nodeType==1 && f.childNodes[0].nodeName==useBlock) 
      {
      newSpan = f.childNodes[0];

      var spans = newSpan.getElementsByTagName(useBlock);
      if (spans) 
        {
        for (var j=0; j<spans.length; j++) 
          {
          if(arrStyles||sClassName)copyStyleClass(spans[j],arrStyles,sClassName);
          else copyAttribute(spans[j], f);
          }
        }

      if(arrStyles||sClassName)copyStyleClass(newSpan,arrStyles,sClassName);
      else copyAttribute(newSpan, f);

      range = oEditor.document.createRange();

      //check whether this is the font tag to start/end the selection
      if (f.getAttribute("startcont")=="this") startCont = newSpan;
      if (f.getAttribute("endcont")=="this") endCont = newSpan;

      range.selectNode(f);
      range.insertNode(newSpan);
      range.selectNode(f);
      range.deleteContents();
      } 
    else 
      {
      //check if there are spans in the selection
      var spans = f.getElementsByTagName(useBlock);
      if (spans) 
        {
        for (var j=0; j<spans.length; j++) 
          {
          if(arrStyles||sClassName)copyStyleClass(spans[j],arrStyles,sClassName);
          else copyAttribute(spans[j], f);
          }
        }

      newSpan = oEditor.document.createElement(useBlock);
      newSpan.innerHTML = f.innerHTML;

      if(arrStyles||sClassName)copyStyleClass(newSpan,arrStyles,sClassName);
      else copyAttribute(newSpan, f);

      //check whether this is the font tag to start/end the selection
      if (f.getAttribute("startcont")=="this") startCont = newSpan;
      if (f.getAttribute("endcont")=="this") endCont = newSpan;

      f.parentNode.replaceChild(newSpan, f);
      }
    }

  //create selection
  //set selection start
  range = oEditor.document.createRange();
  range.setStart(startCont.childNodes[0], 0);
  //set selection end
  var lastNode = endCont.childNodes[endCont.childNodes.length-1];
  var endOffsetPos = 0;
  if (lastNode.nodeType==Node.TEXT_NODE) 
    {
    endOffsetPos = lastNode.nodeValue.length;
    } 
  else 
    {
    endOffsetPos = lastNode.childNodes.length;
    }
  range.setEnd(lastNode, endOffsetPos);
  //do the selection
  oSel = oEditor.getSelection();
  oSel.removeAllRanges();
  oSel.addRange(range);
  };
/******** /NEW SPAN OPERATION *********/

/*** REALTIME ***/

function editorDoc_onkeyup(oEdt)
    {
    
    if(oEdt.tmKeyup) {clearTimeout(oEdt.tmKeyup); oEdt.tmKeyup=null;} 
    if(!oEdt.tmKeyup)oEdt.tmKeyup=setTimeout(function(){realTime(oEdt);}, 1000);

    //realTime(edtObj);
    };
function editorDoc_onmouseup(e, oName)
    {
    var edtObj=eval(oName);
    var edtFrm=document.getElementById("idContent"+edtObj.oName);
    
    oUtil.activeElement=null;//focus ke editor, jgn pakai selection dari tag selector
    oUtil.oName=oName;
    oUtil.oEditor=edtFrm.contentWindow;
    oUtil.obj=edtObj;
    edtObj.hide();//pengganti onfocus
    realTime(edtObj);      
    };
function setActiveEditor(edtObj)
    {
    oUtil.oName=edtObj.oName;
    oUtil.oEditor=document.getElementById("idContent"+edtObj.oName).contentWindow;
    oUtil.obj=edtObj;
    };

var arrTmp=[];
function GetElement(oElement,sMatchTag)//Used in realTime() only.
    {
    while (oElement!=null&&oElement.tagName!=sMatchTag)
        {
        if(oElement.tagName=="BODY")return null;
        oElement=oElement.parentNode;
        }
    return oElement;
    };
    
var arrTmp2=[];//TAG SELECTOR
function realTime(edtObj)
    {
    try{
    var oName = edtObj.oName;

    var oEditor=document.getElementById("idContent"+oName).contentWindow;

    var oSel=oEditor.getSelection();
    var element = getSelectedElement(oSel);

    var obj=edtObj;
    var tbar=obj.tbar;
    var btn=null;

    //Enable/Disable Table Edit & Cell Edit Menu
    if(obj.btnTable)
        {
        
        var btn=tbar.btns["btnTableEdit"+oName];
        var ddTbl=isDDs[btn.ddId];
        ddTbl.enableItem("mnuTableSize"+oName, true);
        ddTbl.enableItem("mnuTableEdit"+oName, true);
        ddTbl.enableItem("mnuCellEdit"+oName, true);
        var oTable=GetElement(element,"TABLE");
        if (oTable)
            {
            ddTbl.enableItem("mnuCellEdit"+oName, false);
            btn.setState(1);
            } 
        else btn.setState(5);

        var oTD=GetElement(element,"TD");
        if (oTD)
            {
            ddTbl.enableItem("mnuCellEdit"+oName, true);
            }
        }

    //REALTIME BUTTONS HERE
    var doc=oEditor.document;
    
    if(obj.btnParagraph)
        {
        btn=tbar.btns["btnParagraph"+oName];
        btn.setState(doc.queryCommandEnabled("FormatBlock")?1:5);        
        }
    if(obj.btnFontName)
        {
        btn=tbar.btns["btnFontName"+oName];
        btn.setState(doc.queryCommandEnabled("FontName")?1:5);
        }

    if(obj.btnFontSize)
        {
        btn=tbar.btns["btnFontSize"+oName];
        btn.setState(doc.queryCommandEnabled("FontSize")?1:5);
        }
    if(obj.btnPaste)
        {
        btn=tbar.btns["btnPaste"+oName];
        btn.setState(doc.queryCommandEnabled("Paste")?1:5);
        }
    if(obj.btnUndo)
        {
        btn=tbar.btns["btnUndo"+oName];
        btn.setState(!obj.arrUndoList[0]?5:1);
        }
    if(obj.btnRedo)
        {
        btn=tbar.btns["btnRedo"+oName];
        btn.setState(!obj.arrRedoList[0]?5:1);
        }

    if(obj.btnBold)
        {
        btn=tbar.btns["btnBold"+oName];
        btn.setState(doc.queryCommandEnabled("Bold")?(doc.queryCommandState("Bold")?4:1):5);
        }
        
    if(obj.btnItalic)
        {
        btn=tbar.btns["btnItalic"+oName];
        btn.setState(doc.queryCommandEnabled("Italic")?(doc.queryCommandState("Italic")?4:1):5);
        }

    if(obj.btnUnderline)
        {
        btn=tbar.btns["btnUnderline"+oName];
        btn.setState(doc.queryCommandEnabled("Underline")?(doc.queryCommandState("Underline")?4:1):5);
        }

    if(obj.btnStrikethrough)
        {
        btn=tbar.btns["btnStrikethrough"+oName];
        btn.setState(doc.queryCommandEnabled("Strikethrough")?(doc.queryCommandState("Strikethrough")?4:1):5);
        }

    if(obj.btnSuperscript)
        {
        btn=tbar.btns["btnSuperscript"+oName];
        btn.setState(doc.queryCommandEnabled("Superscript")?(doc.queryCommandState("Superscript")?4:1):5);
        }

    if(obj.btnSubscript)
        {
        btn=tbar.btns["btnSubscript"+oName];
        btn.setState(doc.queryCommandEnabled("Subscript")?(doc.queryCommandState("Subscript")?4:1):5);
        }

    if(obj.btnNumbering)
        {
        btn=tbar.btns["btnNumbering"+oName];
        btn.setState(doc.queryCommandEnabled("InsertOrderedList")?(doc.queryCommandState("InsertOrderedList")?4:1):5);
        }
        
    if(obj.btnBullets)
        {
        btn=tbar.btns["btnBullets"+oName];
        btn.setState(doc.queryCommandEnabled("InsertUnorderedList")?(doc.queryCommandState("InsertUnorderedList")?4:1):5);
        }

    if(obj.btnJustifyLeft)
        {
        btn=tbar.btns["btnJustifyLeft"+oName];
        btn.setState(doc.queryCommandEnabled("JustifyLeft")?(doc.queryCommandState("JustifyLeft")?4:1):5);
        }
    if(obj.btnJustifyCenter)
        {
        btn=tbar.btns["btnJustifyCenter"+oName];
        btn.setState(doc.queryCommandEnabled("JustifyCenter")?(doc.queryCommandState("JustifyCenter")?4:1):5);
        }

    if(obj.btnJustifyRight)
        {
        btn=tbar.btns["btnJustifyRight"+oName];
        btn.setState(doc.queryCommandEnabled("JustifyRight")?(doc.queryCommandState("JustifyRight")?4:1):5);
        }
    if(obj.btnJustifyFull)
        {
        btn=tbar.btns["btnJustifyFull"+oName];
        btn.setState(doc.queryCommandEnabled("JustifyFull")?(doc.queryCommandState("JustifyFull")?4:1):5);
        }

    if(obj.btnIndent)
        {
        btn=tbar.btns["btnIndent"+oName];
        btn.setState(doc.queryCommandEnabled("Indent")?1:5);
        }

    if(obj.btnOutdent)
        {
        btn=tbar.btns["btnOutdent"+oName];
        btn.setState(doc.queryCommandEnabled("Outdent")?1:5);
        }

    if(obj.btnLTR)
        {
        btn=tbar.btns["btnLTR"+oName];
        btn.setState(element.dir?(element.dir.toLowerCase()=="ltr"?4:1):1);
        }
    if(obj.btnRTL)
        {
        btn=tbar.btns["btnRTL"+oName];
        btn.setState(element.dir?(element.dir.toLowerCase()=="rtl"?4:1):1);
        }


    var v=(element?1:5);
    if(obj.btnForeColor)tbar.btns["btnForeColor"+oName].setState(v);
    if(obj.btnBackColor)tbar.btns["btnBackColor"+oName].setState(v);
    if(obj.btnLine)tbar.btns["btnLine"+oName].setState(v);

    try{oUtil.onSelectionChanged()}catch(e){;}

    try{obj.onSelectionChanged()}catch(e){;}

  //STYLE SELECTOR ~~~~~~~~~~~~~~~~~~
  var idStyles=document.getElementById("idStyles"+oName);
  if(idStyles.innerHTML!="")
    {
    var oElement;
    if(oUtil.activeElement)
      oElement=oUtil.activeElement;
    else
      oElement = getSelectedElement(oSel);    
    var sCurrClass=oElement.className;
    
    var oRows=document.getElementById("tblStyles"+oName).rows;
    for(var i=0;i<oRows.length-1;i++)
      {
      sClass=oRows[i].childNodes[0].childNodes[0].innerHTML;
      if(sClass.split(".").length>1 && sClass!="")sClass=sClass.split(".")[1];
      if(sCurrClass==sClass)
        {
        oRows[i].style.marginRight="1px";
        oRows[i].style.backgroundColor=obj.styleSelectionHoverBg;
        oRows[i].style.color=obj.styleSelectionHoverFg;
        }
      else
        {
        oRows[i].style.marginRight="";
        oRows[i].style.backgroundColor="";
        oRows[i].style.color="";
        }
      }
    }

    //TAG SELECTOR ~~~~~~~~~~~~~~~~~~
  if(obj.useTagSelector)
    {
    oElement=element;
    var sHTML="";var i=0;
    arrTmp2=[];//clear
    while (oElement!=null && oElement.tagName!="BODY" && oElement.nodeType==1)
      {
      arrTmp2[i]=oElement;
      sHTML = "&nbsp; &lt;<span id=tag"+oName+i+" unselectable=on style='text-decoration:underline;cursor:pointer' onclick=\""+oName+".selectElement("+i+")\">" + oElement.tagName + "</span>&gt;" + sHTML;
      oElement = oElement.parentNode;
      i++;
      }
    sHTML = "&nbsp;&lt;BODY&gt;" + sHTML;
    document.getElementById("idElNavigate"+oName).innerHTML = sHTML;
    document.getElementById("idElCommand"+oName).style.display="none";
    for (i=0; i<arrTmp2.length; i++) 
      {
      document.getElementById("tag"+oName+i).addEventListener("click", new Function(oName+".selectElement("+i+")"), true);
      }
    }
        
    }catch(e){;}

    };

function realtimeFontSelect(oName)
    {
    var oEditor=document.getElementById("idContent"+oName).contentWindow;
    var sFontName = oEditor.document.queryCommandValue("FontName");
    var edt=eval(oName);
    
    var found=false;
    for (var i=0;i<edt.arrFontName.length;i++) {
      if(sFontName==edt.arrFontName[i]) { found=true; break; }
    }
    if(found) {
      isDDs["ddFontName"+oName].selectItem("btnFontName_"+i+oName, true);
    } else {
      isDDs["ddFontName"+oName].clearSelection();
    }


    };
function realtimeSizeSelect(oName)
    {
    var oEditor=document.getElementById("idContent"+oName).contentWindow;
    var sFontSize=oEditor.document.queryCommandValue("FontSize");
    
    var edt=eval(oName);

    var found=false;
    for (var i=0;i<edt.arrFontSize.length;i++) {
        if(sFontSize==edt.arrFontSize[i][1]) { found=true; break; }
    }
    if(found) {
      isDDs["ddFontSize"+oName].selectItem("btnFontSize_"+i+oName, true);
    } else {
      isDDs["ddFontSize"+oName].clearSelection();
    }
    };

/*** TAG SELECTOR ***/
function moveTagSelector()
    {
    var edtArea=document.getElementById("idArea"+this.oName);
    var nWidth=edtArea.offsetWidth-90;
    var icPath=this.scriptPath.substring(0, this.scriptPath.indexOf("scripts_moz/"))+this.iconPath;    
    /*
    idElNavigate width seharusnya 100%. Dibuat px utk menghindari flicker problem di Nets8
    */
    var sTagSelTop="<table unselectable=on ondblclick='"+this.oName+".moveTagSelector()' width='100%' cellpadding=0 cellspacing=0 style='border:#cfcfcf 1px solid;border-bottom:none'><tr style='background-color:#f4f4f4;font-family:arial;font-size:10px;color:black;'>"+
        "<td id=idElNavigate"+ this.oName +" style='padding:1px;width:"+nWidth+"px' valign=top>&nbsp;</td>"+
        "<td align=right valign='center' nowrap>"+
        "<span id=idElCommand"+ this.oName +" unselectable=on style='vertical-align:middle;display:none;text-decoration:underline;cursor:pointer;padding-right:5px;' onclick='"+this.oName+".removeTag()'>"+getTxt("Remove Tag")+"</span>"+
        "</td></tr></table>";

    var sTagSelBottom="<table unselectable=on ondblclick='"+this.oName+".moveTagSelector()' width='100%' cellpadding=0 cellspacing=0 style='border-left:#cfcfcf 1px solid;border-right:#cfcfcf 1px solid;'><tr style='background-color:#f4f4f4;font-family:arial;font-size:10px;color:black;'>"+
        "<td id=idElNavigate"+ this.oName +" style='padding:1px;width:"+nWidth+"px' valign=top>&nbsp;</td>"+
        "<td align=right valign='center' nowrap>"+
        "<span id=idElCommand"+ this.oName +" unselectable=on style='vertical-align:middle;display:none;text-decoration:underline;cursor:pointer;padding-right:5px;' onclick='"+this.oName+".removeTag()'>"+getTxt("Remove Tag")+"</span>"+
        "</td></tr></table>";

    var selTop = document.getElementById("idTagSelTop"+this.oName);
    var selTopRow = document.getElementById("idTagSelTopRow"+this.oName);
    var selBottom = document.getElementById("idTagSelBottom"+this.oName);
    var selBottomRow = document.getElementById("idTagSelBottomRow"+this.oName);

    if(this.TagSelectorPosition=="top")
        {
        selTop.innerHTML="";
        selBottom.innerHTML=sTagSelBottom;
        selTopRow.style.display="none";
        selBottomRow.style.display="";
        this.TagSelectorPosition="bottom";
        }
    else//if(this.TagSelectorPosition=="bottom")
        {
        selTop.innerHTML=sTagSelTop;
        selBottom.innerHTML="";
        selTopRow.style.display="";
        selBottomRow.style.display="none";
        this.TagSelectorPosition="top";
        }
    };
function selectElement(i)
    {
    if(!this.useTagSelector)return;
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    
    var range = oEditor.document.createRange();
    range.selectNode(arrTmp2[i]);

    var oSel = oEditor.getSelection();
    oSel.removeAllRanges();
    oSel.addRange(range);

    oActiveElement = arrTmp2[i];
    if(oActiveElement.tagName!="TD"&&
        oActiveElement.tagName!="TR"&&
        oActiveElement.tagName!="TBODY"&&
        oActiveElement.tagName!="LI")
        document.getElementById("idElCommand"+this.oName).style.display="";

    for(var j=0;j<arrTmp2.length;j++)document.getElementById("tag"+this.oName+j).style.background="";
    document.getElementById("tag"+this.oName+i).style.background="DarkGray";
    
    if(oActiveElement)
        oUtil.activeElement=oActiveElement;//Set active element in the Editor
        
    this.focus();
    };
function removeTag()
    {
    this.saveForUndo();//Save for Undo
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    
    var oSel=oEditor.getSelection();
    var element = getSelectedElement(oSel);
    var nearElement = element.nextSibling==null ? (element.previousSibling == null ? element.parentNode :element.previousSibling) : element.nextSibling;
    switch (element.nodeName) 
    {
        case "TABLE": ;
        case "IMG": ;
        case "INPUT": ;
        case "FORM": ;
        case "SELECT":
            element.parentNode.removeChild(element);
            break;
        default:
            oSel = oEditor.getSelection();
            var range = oSel.getRangeAt(0);
            var docFrag = range.createContextualFragment(element.innerHTML);
            range.deleteContents();
            range.insertNode(docFrag);
            try { oEditor.document.designMode="on"; } catch (e) {}
            break;
    }

    oSel=oEditor.getSelection();
    oSel.removeAllRanges();
    var range = oEditor.document.createRange();
    range.setStart(nearElement, 0);
    range.setEnd(nearElement, 0);
    oSel.addRange(range);
    
    this.focus();
    realTime(this);    
    };

/*** Apply Formatting ***/
function doCmd(sCmd,sOption)
    {
  if(sCmd=="Bold"||sCmd=="Italic"||sCmd=="Underline"||sCmd=="Strikethrough"||
    sCmd=="Superscript"||sCmd=="Subscript"||
    sCmd=="Indent"||sCmd=="Outdent"||sCmd=="InsertHorizontalRule")
    this.saveForUndo();//Save for Undo

    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    oEditor.document.execCommand(sCmd,false,sOption);
    realTime(this);
    };
function applyColor(sType,sColor)
    {
    this.hide();
    this.focus();//Focus stuff
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    this.saveForUndo();
    if (sColor!=null && sColor!="") 
    {
        oEditor.document.execCommand(sType,false,sColor);
        //spy setelah apply bisa select & ditampilkan di tag selector
        var sel = oEditor.getSelection();
        var range = sel.getRangeAt(0);
        if (range.startContainer.nodeType==Node.TEXT_NODE)
      {
            var el = range.startContainer.nextSibling;
            if (el)
        {
                range = oEditor.document.createRange();
                range.selectNode(el);
                sel = oEditor.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
        }
      }
    }
  else
    {
        var el = getSelectedElement(oEditor.getSelection());
        if (sType=="ForeColor")
      {
      el.style.color="";
      }
    else if (sType=="HiliteColor")
      {
      el.style.backgroundColor = "";
      }
    }

    realTime(this);
    if(sColor=="")return;
    //this.selectElement(0);
    };
function applyParagraph(val)
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    this.hide();
    this.saveForUndo();
    this.doCmd("FormatBlock",val);
    };
function applyFontName(val)
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    this.hide();
    this.saveForUndo();
    this.doCmd("fontname",val);
    };
function applyFontSize(val)
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    this.hide();
    this.saveForUndo();
    this.doCmd("fontsize",val);
    
    replaceWithSpan(oEditor);
    realTime(this);
    };
function applyBullets()
    {
    this.saveForUndo();
    this.doCmd("InsertUnOrderedList");
  this.tbar.btns["btnNumbering"+this.oName].setState(1);

    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    var oElement = getSelectedElement(oSel);
    while (oElement!=null&&
        oElement.tagName!="OL"&&
        oElement.tagName!="UL")
        {
        if(oElement.tagName=="BODY")return;
        oElement=oElement.parentNode;
        }
    oElement.removeAttribute("type",0);
    oElement.style.listStyleImage="";
    };
function applyNumbering()
    {
    this.saveForUndo();
    this.doCmd("InsertOrderedList");
    this.tbar.btns["btnBullets"+this.oName].setState(1);

    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    var oElement = getSelectedElement(oSel);
    while (oElement!=null&&
        oElement.tagName!="OL"&&
        oElement.tagName!="UL")
        {
        if(oElement.tagName=="BODY")return;
        oElement=oElement.parentNode;
        }
    oElement.removeAttribute("type",0);
    oElement.style.listStyleImage="";
    };
function applyJustifyLeft()
    {
    this.saveForUndo();
    this.doCmd("JustifyLeft");
    };
function applyJustifyCenter()
    {
    this.saveForUndo();
    this.doCmd("JustifyCenter");
    };
function applyJustifyRight()
    {
    this.saveForUndo();
    this.doCmd("JustifyRight");
    };
function applyJustifyFull()
    {
    this.saveForUndo();
    this.doCmd("JustifyFull");
    };
function applyBlockDirLTR()
    {
    this.saveForUndo();
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    var oEl = getSelectedElement(oSel);
    if (oEl.dir) oEl.removeAttribute("dir"); else oEl.dir = "ltr"; 
    this.focus();
    };
function applyBlockDirRTL()
    {
    this.saveForUndo();
    //this.doCmd("BlockDirRTL");
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    var oEl = getSelectedElement(oSel);
    if (oEl.dir) oEl.removeAttribute("dir"); else oEl.dir = "rtl"; 
    this.focus();
    };
function insertCustomTag(index)
  {
  this.insertHTML(this.arrCustomTag[index][1]);
  this.hide();
  this.focus();
  };
function expandSelection()
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    var range = oSel.getRangeAt(0);
    if (range.startContainer.nodeType == Node.TEXT_NODE) 
        {
        if (range.toString() == "") 
            {
            //select a word
            var sPos = range.startOffset;
            var ePos = range.endOffset;
            var startCont = range.startContainer;
            var str = startCont.nodeValue;
            sPos = str.substring(0, range.startOffset).search(/(\W+\w*)$/i);
            sPos = sPos == -1 ? 0 : sPos;
            var tPos = str.substring(sPos, range.startOffset).search(/\w+/i);
            sPos += (tPos==-1 ? str.substring(sPos, range.startOffset).length : tPos);
            ePos = str.substr(range.endOffset).search(/\W+/i);
            ePos = ePos == -1 ? str.length : ePos + range.endOffset;
            range = oEditor.document.createRange();
            range.setStart(startCont, sPos);
            range.setEnd(startCont, ePos);
            oSel = oEditor.getSelection();
            oSel.removeAllRanges();
            oSel.addRange(range);
            }
        }
    
    return;
    };
function selectParagraph()
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    var selParent = getSelectedElement(oSel);
    if(selParent)
        {
        if(oSel.getRangeAt(0).toString()=="")
            {
            var oElement=selParent;
            while (oElement!=null&&
                oElement.tagName!="H1"&&
                oElement.tagName!="H2"&&
                oElement.tagName!="H3"&&
                oElement.tagName!="H4"&&
                oElement.tagName!="H5"&&
                oElement.tagName!="H6"&&
                oElement.tagName!="PRE"&&
                oElement.tagName!="P"&&
                oElement.tagName!="DIV")
                {
                if(oElement.tagName=="BODY")return;
                oElement=oElement.parentNode;
                }
            
            var range = oEditor.document.createRange();
            range.selectNode(oElement);
            oSel = oEditor.getSelection();
            oSel.removeAllRanges();
            oSel.addRange(range);
            }
        }
    };
    
function insertHTML(sHTML)
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    var range = oSel.getRangeAt(0);
    
    this.saveForUndo();
    
    var docFrag = range.createContextualFragment(sHTML);
    range.collapse(true);
    var lastNode = docFrag.childNodes[docFrag.childNodes.length-1];
    range.insertNode(docFrag);
    try { oEditor.document.designMode="on"; } catch (e) {}
    if (lastNode.nodeType==Node.TEXT_NODE) 
        {
        range = oEditor.document.createRange();
        range.setStart(lastNode, lastNode.nodeValue.length);
        range.setEnd(lastNode, lastNode.nodeValue.length);
        oSel = oEditor.getSelection();
        oSel.removeAllRanges();
        oSel.addRange(range);
        
        var comCon=range.commonAncestorContainer;
        if(comCon && comCon.parentNode) {
          try {comCon.parentNode.normalize();}catch(e) {}
          }
        }
    };
    
function insertLink(url,title,target)
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    var range = oSel.getRangeAt(0);
    
    this.saveForUndo();

    var emptySel = false;
    if(range.toString()=="")
        {
        if (range.startContainer.nodeType==Node.ELEMENT_NODE) {
          if (range.startContainer.childNodes[range.startOffset].nodeType != Node.TEXT_NODE) { 
              if (range.startContainer.childNodes[range.startOffset].nodeName=="BR") emptySel = true; else emptySel=false;  
          } else { 
              emptySel = true; 
          }
        } else {
              emptySel = true;
        }
        
        if (emptySel) {
          var cap = (title!="" && title!=null ? title : url);
          var node = oEditor.document.createTextNode(cap);
          range.insertNode(node);
          try { oEditor.document.designMode="on"; } catch (e) {}

          range = oEditor.document.createRange();
          range.setStart(node, 0);
          range.setEnd(node, cap.length);

          oSel = oEditor.getSelection();
          oSel.removeAllRanges();
          oSel.addRange(range);
        }
    }
    var isSelInMidText = (range.startContainer.nodeType==Node.TEXT_NODE) && (range.startOffset>0);
    oEditor.document.execCommand("CreateLink", false, url);
    
    oSel = oEditor.getSelection();
    range = oSel.getRangeAt(0);

        //get A element
        if (range.startContainer.nodeType == Node.TEXT_NODE) {
            var node = (emptySel || !isSelInMidText ? range.startContainer.parentNode : range.startContainer.nextSibling); 

//A node
            range = oEditor.document.createRange();
            range.selectNode(node);
            
            oSel = oEditor.getSelection();
            oSel.removeAllRanges();
            oSel.addRange(range);
            
        }
        
        var oEl = range.startContainer.childNodes[range.startOffset];
        if(oEl) {
            if(target!="" && target!=undefined)oEl.target=target;
        }
    };
    
function clearAll()
    {
    if(confirm(getTxt("Are you sure you wish to delete all contents?"))==true)
        {
        this.saveForUndo();
        var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
        oEditor.document.body.innerHTML="<BR>";
        oEditor.focus();
        }
    };
function applySpan(blockTag)
    {
    var useBlock = "SPAN";
    if (blockTag!=null && blockTag!="") useBlock = blockTag;
    
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    
    var range;
    var oElement;
    var sHTML;
    if (!isTextSelected(oSel)) { //if not text selection
        range = oSel.getRangeAt(0);
        oElement = getSelectedElement(oSel);
        if(oElement.nodeName==useBlock) return oElement;
        return;
    }
    range = oSel.getRangeAt(0);
    sHTML=range.toString();
    
    var docFrag = range.extractContents();
    var idSpan = oEditor.document.createElement(useBlock);
    idSpan.appendChild(docFrag);
    range.insertNode(idSpan);
    try { oEditor.document.designMode="on"; } catch (e){}
    
    range = oEditor.document.createRange();
    range.selectNode(idSpan);
    oSel = oEditor.getSelection();
    oSel.removeAllRanges();
    oSel.addRange(range);
    
    return idSpan;
    };
function makeAbsolute()
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var oSel=oEditor.getSelection();
    var oEl = getSelectedElement(oSel);
    
    this.saveForUndo();
    
    if(oEl!=null && oEl.nodeName!="BODY")
        {
        if (oEl.style.position == "absolute") oEl.style.position="";
        else oEl.style.position="absolute";
        }
    };

/*** Table Insert Dropdown ***/
function doOver_TabCreate(el)
    {
    var oTD=el;
    var oTable=oTD.parentNode.parentNode.parentNode;
    var nRow=oTD.parentNode.rowIndex;
    var nCol=oTD.cellIndex; 
    var rows=oTable.rows;
    var custCell = rows[rows.length-1].childNodes[0];
    custCell.innerHTML="<div align=right>"+(nRow*1+1) + " x " + (nCol*1+1) + " " + getTxt("Table Dimension Text") + " ...  &nbsp;&nbsp;&nbsp;<span style='text-decoration:underline'>" + getTxt("Table Advance Link") + "</span>&nbsp;</div>";
    
    custCell.style.backgroundColor="";
    custCell.style.color="#000000";
    custCell.style.border="0px";
    for(var i=0;i<rows.length-1;i++) 
        {
        var oRow=rows[i];
        for(var j=0;j<oRow.childNodes.length;j++)
            {
            var oCol=oRow.childNodes[j];
            if(i<=nRow&&j<=nCol)oCol.style.backgroundColor="#316ac5";
            else oCol.style.backgroundColor="#ffffff";
            }
        }
    //event.cancelBubble=true;
    };
function doOut_TabCreate(el)
    {
    var oTable=el;
    if(oTable.nodeName!="TABLE")return;
    var rows=oTable.rows;
    rows[rows.length-1].childNodes[0].innerHTML=getTxt("Advanced Table Insert");
    for(var i=0;i<rows.length-1;i++) 
        {
        var oRow=rows[i];
        for(var j=0;j<oRow.childNodes.length;j++)
            {
            var oCol=oRow.childNodes[j];
            oCol.style.backgroundColor="#ffffff";
            }
        }
    //event.cancelBubble=true;
    };
function doRefresh_TabCreate()
    {
    var oTable=document.getElementById("dropTableCreate"+this.oName);
    var rows=oTable.rows;
    rows[rows.length-1].childNodes[0].innerHTML=getTxt("Advanced Table Insert");
    for(var i=0;i<rows.length-1;i++) 
        {
        var oRow=rows[i];
        for(var j=0;j<oRow.childNodes.length;j++)
            {
            var oCol=oRow.childNodes[j];
            oCol.style.backgroundColor="#ffffff";
            }
        }
    };
function doClick_TabCreate(el)
    {
    this.hide();
    
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    
    var oTD=el;
    var nRow=oTD.parentNode.rowIndex+1;
    var nCol=oTD.cellIndex+1;
    
    this.saveForUndo();

    var sHTML="<table style='border-collapse:collapse;width:100%;' selThis='selThis'>";
    for(var i=1;i<=nRow;i++)
        {
        sHTML+="<tr>";
        for(var j=1;j<=nCol;j++)
            {           
            //sHTML+="<td style='border:#000000 1px solid'><br/></td>";
            sHTML+="<td><br/></td>";
            }
        sHTML+="</tr>";
        }
    sHTML+="</table>";
    
    var oSel=oEditor.getSelection();
    var range = oSel.getRangeAt(0);
    range.collapse(true);
    
    var docFrag = range.createContextualFragment(sHTML);
    range.insertNode(docFrag);
    try { oEditor.document.designMode="on"; } catch (e) {}
    var allTabs = oEditor.document.getElementsByTagName("TABLE");
    for (var i = 0; i< allTabs.length; i++) {
        if (allTabs[i].getAttribute("selThis") == "selThis") {
            range = oEditor.document.createRange();
            range.selectNode(allTabs[i]);
            oSel = oEditor.getSelection();
            oSel.removeAllRanges();
            oSel.addRange(range);
            allTabs[i].removeAttribute("selThis");
            break;
        }
    }
    realTime(this);
    };

/*** doKeyPress ***/
function doKeyPress(evt,obj)
    {    
    if(!obj.arrUndoList[0]){obj.saveForUndo();}//pengganti saveForUndo_First

    if(evt.ctrlKey)
        {
        switch (evt.keyCode) 
            {
            //case 89: obj.doRedo(); break; //redo, CTRL-Y
            //case 90: obj.doUndo(); break; //undo, CTRL-Z
            case 86: //CTRL-V 
              if(obj.pasteTextOnCtrlV) {
                evt.preventDefault();
                modelessDialogShow(obj.scriptPath+"paste_text.htm",400,280);
              } else {
                window.setTimeout("eval('"+obj.oName+"').cleanDeprecated();",5);
              }
              break; 
            //case 88: obj.saveForUndo(); break; //CTRL-X
            case 66: obj.doCmd("Bold"); evt.preventDefault(); break; //CTRL-B      
            case 73: obj.doCmd("Italic"); evt.preventDefault(); break; //CTRL-I
            case 85: obj.doCmd("Underline"); evt.preventDefault(); break; //CTRL-U
            }
        }

    if(evt.keyCode==37||evt.keyCode==38||evt.keyCode==39||evt.keyCode==40)//Arrow
        {
        obj.saveForUndo();//Save for Undo
        }

    if(evt.keyCode==13)
        { 
        obj.saveForUndo();//Save for Undo
        }

  obj.onKeyPress();
    };

/*** fullScreen ***/
function doFullScreen()
    {
    var oEditor=document.getElementById("idContent"+this.oName).contentWindow;
    var edtArea = document.getElementById("idArea"+this.oName);

    this.hide();

    if(this.stateFullScreen)
        {
        this.onNormalScreen();
        this.stateFullScreen=false;
        document.body.style.overflow="";
        document.getElementById("id_refresh_z_index").style.margin="0px";
        edtArea.style.position="";
        edtArea.style.top="0px";
        edtArea.style.left="0px";

        if(this.width.toString().indexOf("%")!=-1)edtArea.style.width=this.width;
        else edtArea.style.width=parseInt(this.width)+"px";

        if(this.height.toString().indexOf("%")!=-1)edtArea.style.height=this.height;
        else edtArea.style.height=parseInt(this.height)+"px";    

        for(var i=0;i<oUtil.arrEditor.length;i++)
            {
            if(oUtil.arrEditor[i]!=this.oName) 
              {
              document.getElementById("idArea"+oUtil.arrEditor[i]).style.display="";
              try { document.getElementById("idContent"+oUtil.arrEditor[i]).contentWindow.document.designMode="on"; } catch (e) {}//new
              }
            }
        }
    else
        {
        this.onFullScreen();
        this.stateFullScreen=true;
        window.scroll(0,0);
        document.body.style.overflow="hidden";
        document.getElementById("id_refresh_z_index").style.margin="70px";
        edtArea.style.position="absolute";
        edtArea.style.top="0px";
        edtArea.style.left="0px";
        edtArea.style.width=window.innerWidth+"px";
        edtArea.style.height=window.innerHeight+"px";
        edtArea.style.zIndex = 2000;

        for(var i=0;i<oUtil.arrEditor.length;i++)
            {
            if(oUtil.arrEditor[i]!=this.oName) document.getElementById("idArea"+oUtil.arrEditor[i]).style.display="none";
            }
        oEditor.focus();
        }
       
    try { oEditor.document.designMode="on"; } catch (e) {}
  
    var idStyles=document.getElementById("idStyles"+this.oName);
    idStyles.innerHTML="";
    };

/*** Open Dialog ***/
function modelessDialogShow(url,width,height,p,opt)
  {
  windowOpen(url,width,height,false,p,opt);
  };
function modalDialogShow(url,width,height,p,opt)
  {
  windowOpen(url,width,height,true,p,opt);
  };

function windowOpen(url,wd,hg,ov,p,opt)
  {
      var id = "ID"+(new Date()).getTime();
      var f = new ISWindow(id);
      f.iconPath = oUtil.scriptPath.substring(0, oUtil.scriptPath.indexOf("scripts_moz/"))+"scripts/icons/";
      f.show({width:wd+"px", height:hg+"px",overlay:ov,center:true, url:url, openerWin:p, options:opt});
  };

function hide()
    {
    hideAllDD();
  
    this.oColor1.hide();
    this.oColor2.hide();

    //additional
    if(this.btnTable)this.doRefresh_TabCreate();
    
    };

/*** HTML to XHTML ***/
function lineBreak1(tag) //[0]<TAG>[1]text[2]</TAG>
  {
  arrReturn = ["\n","",""];
  if( tag=="A"||tag=="B"||tag=="CITE"||tag=="CODE"||tag=="EM"|| 
    tag=="FONT"||tag=="I"||tag=="SMALL"||tag=="STRIKE"||tag=="BIG"||
    tag=="STRONG"||tag=="SUB"||tag=="SUP"||tag=="U"||tag=="SAMP"||
    tag=="S"||tag=="VAR"||tag=="BASEFONT"||tag=="KBD"||tag=="TT"||tag=="SPAN"||tag=="IMG") 
    arrReturn=["","",""];

  if( tag=="TEXTAREA"||tag=="TABLE"||tag=="THEAD"||tag=="TBODY"|| 
    tag=="TR"||tag=="OL"||tag=="UL"||tag=="DIR"||tag=="MENU"|| 
    tag=="FORM"||tag=="SELECT"||tag=="MAP"||tag=="DL"||tag=="HEAD"|| 
    tag=="BODY"||tag=="HTML") 
    arrReturn=["\n","","\n"];

  if( tag=="STYLE"||tag=="SCRIPT")
    arrReturn=["\n","",""];

  if(tag=="BR"||tag=="HR") 
    arrReturn=["","\n",""];

  return arrReturn;
  };
function fixAttr(s)
  {
  s = String(s).replace(/&/g, "&amp;");
  s = String(s).replace(/</g, "&lt;");
  s = String(s).replace(/"/g, "&quot;");
  return s;
  };
function fixVal(s)
  {
  s = String(s).replace(/&/g, "&amp;");
  s = String(s).replace(/</g, "&lt;");
  var x = escape(s);
  x = unescape(x.replace(/\%A0/gi, "-*REPL*-"));
  s = x.replace(/-\*REPL\*-/gi, "&nbsp;");
  return s;
  };
function recur(oEl,sTab)
  {
  var sHTML="";
  for(var i=0;i<oEl.childNodes.length;i++)
    {
    var oNode=oEl.childNodes[i];
    if(oNode.nodeType==1)//tag
      {
      var sTagName = oNode.nodeName;

      var bDoNotProcess=false;
      if(sTagName.substring(0,1)=="/")
        {
        bDoNotProcess=true;//do not process
        }
      else
        {
        /*** tabs ***/
        var sT= sTab;
        sHTML+= lineBreak1(sTagName)[0];  
        if(lineBreak1(sTagName)[0] !="") sHTML+= sT;//If new line, use base Tabs
        /************/
        }

      if(bDoNotProcess)
        {
        ;//do not process
        }
      else if(sTagName=="OBJECT" || sTagName=="EMBED")
        {   
        s=getOuterHTML(oNode);

        s=s.replace(/\"[^\"]*\"/ig,function(x){           
            x=x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/\s+/ig,"#_#").replace(/&amp;amp;/gi,"&amp;");
            return x});
        s=s.replace(/<([^ >]*)/ig,function(x){return x.toLowerCase()});   
        s=s.replace(/ ([^=]+)=([^"' >]+)/ig," $1=\"$2\"");//new
        
        s=s.replace(/ ([^=]+)=/ig,function(x){return x.toLowerCase()});
        s=s.replace(/#_#/ig," ");
        
        s=s.replace(/<param([^>]*)>/ig,"\n<param$1 />").replace(/\/ \/>$/ig," \/>");//no closing tag

        if(sTagName=="EMBED")
          if(oNode.innerHTML=="")
            s=s.replace(/>$/ig," \/>").replace(/\/ \/>$/ig,"\/>");//no closing tag
        
        s=s.replace(/<param name=\"Play\" value=\"0\" \/>/,"<param name=\"Play\" value=\"-1\" \/>");
        
        sHTML+=s;
        }
      else if(sTagName=="TITLE")
        {
        sHTML+="<title>"+oNode.innerHTML+"</title>";
        }
      else
        {
        if(sTagName=="AREA")
          {
          var sCoords=oNode.coords;
          var sShape=oNode.shape;
          }
          
        var oNode2=oNode.cloneNode(false);       
        s=getOuterHTML(oNode2).replace(/<\/[^>]*>/,"");
        
        if(sTagName=="STYLE")
          {
          var arrTmp=s.match(/<[^>]*>/ig);
          s=arrTmp[0];
          }       

        s=s.replace(/\"[^\"]*\"/ig,function(x){
            //x=x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/\s+/ig,"#_#");
            //x=x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\s+/ig,"#_#");
            x=x.replace(/&/g, "&amp;").replace(/&amp;amp;/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\s+/ig,"#_#");
            return x});
            //info ttg: .replace(/&amp;amp;/g, "&amp;")
            //ini karena '&' di (hanya) '&amp;' selalu di-replace lagi dgn &amp;.
            //tapi kalau &lt; , &gt; tdk (no problem) => default behaviour
    
        s=s.replace(/<([^ >]*)/ig,function(x){return x.toLowerCase()});
        s=s.replace(/ ([^=]+)=([^" >]+)/ig," $1=\"$2\"");
        s=s.replace(/ ([^=]+)=/ig,function(x){return x.toLowerCase()});
        s=s.replace(/#_#/ig," ");
        
        //single attribute
        s=s.replace(/(<hr[^>]*)(noshade="")/ig,"$1noshade=\"noshade\"");
        s=s.replace(/(<input[^>]*)(checked="")/ig,"$1checked=\"checked\"");
        s=s.replace(/(<select[^>]*)(multiple="")/ig,"$1multiple=\"multiple\"");
        s=s.replace(/(<option[^>]*)(selected="")/ig,"$1selected=\"true\"");
        s=s.replace(/(<input[^>]*)(readonly="")/ig,"$1readonly=\"readonly\"");
        s=s.replace(/(<input[^>]*)(disabled="")/ig,"$1disabled=\"disabled\"");
        s=s.replace(/(<td[^>]*)(nowrap="" )/ig,"$1nowrap=\"nowrap\" ");
        s=s.replace(/(<td[^>]*)(nowrap=""\>)/ig,"$1nowrap=\"nowrap\"\>");
        
        s=s.replace(/ contenteditable=\"true\"/ig,"");
        
        if(sTagName=="AREA")
          {
          s=s.replace(/ coords=\"0,0,0,0\"/ig," coords=\""+sCoords+"\"");
          s=s.replace(/ shape=\"RECT\"/ig," shape=\""+sShape+"\"");
          }
          
        var bClosingTag=true;
        if(sTagName=="IMG"||sTagName=="BR"||
          sTagName=="AREA"||sTagName=="HR"|| 
          sTagName=="INPUT"||sTagName=="BASE"||
          sTagName=="LINK")//no closing tag
          {
          s=s.replace(/>$/ig," \/>").replace(/\/ \/>$/ig,"\/>");//no closing tag
          bClosingTag=false;      
          }         
        
        sHTML+=s;       
          
        /*** tabs ***/
        if(sTagName!="TEXTAREA")sHTML+= lineBreak1(sTagName)[1];
        if(sTagName!="TEXTAREA")if(lineBreak1(sTagName)[1] !="") sHTML+= sT;//If new line, use base Tabs
        /************/  
        
        if(bClosingTag)
          {
          /*** CONTENT ***/
          s=getOuterHTML(oNode);
          if(sTagName=="SCRIPT")
            {
            s = s.replace(/<script([^>]*)>[\n+\s+\t+]*/ig,"<script$1>");//clean spaces
            s = s.replace(/[\n+\s+\t+]*<\/script>/ig,"<\/script>");//clean spaces
            s = s.replace(/<script([^>]*)>\/\/<!\[CDATA\[/ig,"");
            s = s.replace(/\/\/\]\]><\/script>/ig,"");
            s = s.replace(/<script([^>]*)>/ig,"");
            s = s.replace(/<\/script>/ig,"");         
            s = s.replace(/^\s+/,'').replace(/\s+$/,'');            

            sHTML+="\n"+
              sT + s + "\n"+sT;

            //sHTML+="\n"+
            //  sT + "//<![CDATA[\n"+
            //  sT + s + "\n" +
            //  sT + "//]]>\n"+sT;

            }
          if(sTagName=="STYLE")
            {       
            s = s.replace(/<style([^>]*)>[\n+\s+\t+]*/ig,"<style$1>");//clean spaces
            s = s.replace(/[\n+\s+\t+]*<\/style>/ig,"<\/style>");//clean spaces         
            s = s.replace(/<style([^>]*)><!--/ig,"");
            s = s.replace(/--><\/style>/ig,"");
            s = s.replace(/<style([^>]*)>/ig,"");
            s = s.replace(/<\/style>/ig,"");          
            s = s.replace(/^\s+/,"").replace(/\s+$/,"");            
            
            sHTML+="\n"+
              sT + "<!--\n"+
              sT + s + "\n" +
              sT + "-->\n"+sT;
            }
          if(sTagName=="DIV"||sTagName=="P")
            {
            if(oNode.innerHTML==""||oNode.innerHTML=="&nbsp;") 
              {
              sHTML+="&nbsp;";
              }
            else sHTML+=recur(oNode,sT+"\t");
            }
          else
          if (sTagName == "STYLE" || sTagName=="SCRIPT")
            {
            //do nothing
            }
          else
            {
            sHTML+=recur(oNode,sT+"\t");  
            }         
            
          /*** tabs ***/
          if(sTagName!="TEXTAREA")sHTML+=lineBreak1(sTagName)[2];
          if(sTagName!="TEXTAREA")if(lineBreak1(sTagName)[2] !="")sHTML+=sT;//If new line, use base Tabs
          /************/
            
          sHTML+="</" + sTagName.toLowerCase() + ">";
          }     
        }     
      }
    else if(oNode.nodeType==3)//text
      {
      sHTML+= fixVal(oNode.nodeValue);
      }
    else if(oNode.nodeType==8)
      {
      if(getOuterHTML(oNode).substring(0,2)=="<"+"%")
        {//server side script
        sTmp=(getOuterHTML(oNode).substring(2));
        sTmp=sTmp.substring(0,sTmp.length-2);
        sTmp = sTmp.replace(/^\s+/,"").replace(/\s+$/,"");
        
        /*** tabs ***/
        var sT= sTab;
        /************/
        
        sHTML+="\n" +
          sT + "<%\n"+
          sT + sTmp + "\n" +
          sT + "%>\n"+sT;
        }
      else
        {//comments

        /*** tabs ***/
        var sT= sTab;
        /************/
        
        sTmp=oNode.nodeValue;
        sTmp = sTmp.replace(/^\s+/,"").replace(/\s+$/,"");
        
        sHTML+="\n" +
          sT + "<!--\n"+
          sT + sTmp + "\n" +
          sT + "-->\n"+sT;
        }
      }
    else
      {
      ;//Not Processed
      }
    }
  return sHTML;
  };

/*** Netscape range methods ***/
function getSelectedElement(sel) 
  {
    var range = sel.getRangeAt(0);
    var node = range.startContainer;
    if (node.nodeType == Node.ELEMENT_NODE) 
    {
        if (range.startOffset >= node.childNodes.length) return node;
        node = node.childNodes[range.startOffset];
    }
    if (node.nodeType == Node.TEXT_NODE) 
    {    
        if (node.nodeValue.length == range.startOffset) 
      {
      var el = node.nextSibling;
      if (el && el.nodeType==Node.ELEMENT_NODE) 
        {
        if (range.endContainer.nodeType==Node.TEXT_NODE && range.endContainer.nodeValue.length == range.endOffset) 
          {
          if (el == range.endContainer.parentNode) 
            {
            return el;
            }
          }
        }
      }    
        while (node!=null && node.nodeType != Node.ELEMENT_NODE) 
      {
            node = node.parentNode;
      }
    }    
    return node;
  };
function isTextSelected(sel) 
  {
    var range = sel.getRangeAt(0);    
    if (range!=null && range.startContainer!=null) 
    {
        return (range.startContainer.nodeType == Node.TEXT_NODE);
    }
    return false;
  };
function getOuterHTML(node) 
  {
    var sHTML = "";
    switch (node.nodeType) 
    {
        case Node.ELEMENT_NODE:
            sHTML = "<" + node.nodeName;
            
            var tagVal ="";
            for (var atr=0; atr < node.attributes.length; atr++) 
        {       
                if (node.attributes[atr].nodeName.substr(0,4) == "_moz" ) continue;
                if (node.attributes[atr].nodeValue.substr(0,4) == "_moz" ) continue;//yus                
                if (node.nodeName=='TEXTAREA' && node.attributes[atr].nodeName.toLowerCase()=='value') 
          {
                    tagVal = node.attributes[atr].nodeValue;
          } 
        else 
          {
                    sHTML += ' ' + node.attributes[atr].nodeName + '="' + node.attributes[atr].nodeValue.replace(/"/gi, "'") + '"';
          }
        }
            sHTML += '>'; 
            sHTML += (node.nodeName!='TEXTAREA' ? node.innerHTML : tagVal);
            sHTML += "</"+node.nodeName+">";
            break;
        case Node.COMMENT_NODE:
            sHTML = "<!"+"--"+node.nodeValue+ "--"+">"; break;
        case Node.TEXT_NODE:
            sHTML = node.nodeValue; break;
    }
    return sHTML;
  };
  
function tbAction(tb, id, edt, sfx) {
  var e=edt, oN=sfx, btn=id.substring(0, id.lastIndexOf(oN));
  
  switch(btn) {
    case "btnSave": e.onSave();break;
    case "btnFullScreen": e.fullScreen(); break;
    case "btnPrint": e.focus();document.getElementById("idContent"+edt.oName).contentWindow.print(); break;
    case "btnSearch": e.hide(); modelessDialogShow(e.scriptPath+"search.htm",375,163); break;
    case "btnSpellCheck": e.hide(); 
      if(e.spellCheckMode=="ieSpell") ; 
      else if(e.spellCheckMode=="NetSpell") checkSpellingById("idContent"+edt.oName);
      break;
    case "btnCut": e.doCmd("Cut"); break;
    case "btnCopy": e.doCmd("Copy"); break;
    //case "btnPaste": e.doPaste(); break;
    //case "btnPasteWord": e.hide(); modelessDialogShow(e.scriptPath+"paste_word.htm",400,280); break;
    //case "btnPasteText": e.hide(); modelessDialogShow(e.scriptPath+"paste_text.htm",400,280); break;
    case "btnUndo": e.doUndo(); break;
    case "btnRedo": e.doRedo(); break;
    case "btnBold": e.doCmd("Bold"); break;
    case "btnItalic": e.doCmd("Italic"); break;
    case "btnUnderline": e.doCmd("Underline"); break;
    case "btnStrikethrough": e.doCmd("Strikethrough"); break;
    case "btnSuperscript": e.doCmd("Superscript"); break;
    case "btnSubscript": e.doCmd("Subscript"); break;
    case "btnJustifyLeft": e.applyJustifyLeft(); break;
    case "btnJustifyCenter": e.applyJustifyCenter(); break;
    case "btnJustifyRight": e.applyJustifyRight(); break;
    case "btnJustifyFull": e.applyJustifyFull(); break;
    case "btnNumbering": e.applyNumbering(); break;
    case "btnBullets": e.applyBullets(); break;
    case "btnIndent": e.doCmd("Indent"); break;
    case "btnOutdent": e.doCmd("Outdent"); break;
    case "btnLTR": e.applyBlockDirLTR(); break;
    case "btnRTL": e.applyBlockDirRTL(); break;
    case "btnForeColor": e.oColor1.show(document.getElementById(id)); break;
    case "btnBackColor": e.oColor2.show(document.getElementById(id)); break;
    case "btnBookmark": e.hide();modelessDialogShow(e.scriptPath+"bookmark.htm",245,216); break;
    case "btnHyperlink": e.hide();modelessDialogShow(e.scriptPath+"hyperlink.htm",380,220); break;
    case "btnImage": e.hide();modelessDialogShow(e.scriptPath+"image.htm",440,351); break;
    case "btnFlash": e.hide();modelessDialogShow(e.scriptPath+"flash.htm",340,275); break;
    case "btnMedia": e.hide();modelessDialogShow(e.scriptPath+"media.htm",340,272); break;
    case "btnContentBlock": e.hide(); eval(e.cmdContentBlock); break;
    case "btnInternalLink": e.hide(); eval(e.cmdInternalLink); break;
    case "btnInternalImage": e.hide(); eval(e.cmdInternalImage); break;
    case "btnCustomObject": e.hide(); eval(e.cmdCustomObject); break;
    case "btnGuidelines": e.runtimeBorder(true); break;
    case "btnAbsolute": e.makeAbsolute(); break;
    case "btnCharacters": e.hide();modelessDialogShow(e.scriptPath+"characters.htm",495,160); break;
    case "btnLine": e.doCmd("InsertHorizontalRule"); break;
    case "btnRemoveFormat": e.doClean(); break;
    case "btnHTMLFullSource": setActiveEditor(edt);e.hide();modalDialogShow(e.scriptPath+"source_html_full.htm",600,450); break;
    case "btnHTMLSource": setActiveEditor(edt);e.hide();modalDialogShow(e.scriptPath+"source_html.htm",600,450); break;
    case "btnXHTMLFullSource": setActiveEditor(edt);e.hide();modalDialogShow(e.scriptPath+"source_xhtml_full.htm",600,450); break;
    case "btnXHTMLSource": setActiveEditor(edt);e.hide();modalDialogShow(e.scriptPath+"source_xhtml.htm",600,450); break;
    case "btnClearAll": e.clearAll(); break;
    case "btnStyles": e.hide(); e.openStyleSelect(); break;
    case "btnParagraph": e.hide(); e.selectParagraph(); break;
    case "btnFontName": e.hide(); e.expandSelection(); realtimeFontSelect(e.oName); break;
    case "btnFontSize": e.hide(); e.expandSelection(); realtimeSizeSelect(e.oName); break;
    case "btnCustomTag": e.hide(); break;    
    default:
      for (var i=0;i<e.arrCustomButtons.length;i++){
        if(e.arrCustomButtons[i][0]==btn) {
          eval(e.arrCustomButtons[i][1]);
          break;
        }
      }    
  }
};

function ddAction(tb, id, edt, sfx) {
  var oN=sfx;
  var e=edt;
  var btn=id.substring(0, id.lastIndexOf(oN));
  
  switch(btn) {
    case "btnPreview1":
      setActiveEditor(edt);
      modalDialogShow(e.scriptPath+"preview.htm",640,480); 
      break;
    case "btnPreview2": 
      setActiveEditor(edt);
      modalDialogShow(e.scriptPath+"preview.htm",800,600); 
      break;
    case "btnPreview3": 
      setActiveEditor(edt);
      modalDialogShow(e.scriptPath+"preview.htm",1024,768); 
      break;
    case "btnTextFormatting": modelessDialogShow(e.scriptPath+"text1.htm",511,480); break;
    case "btnParagraphFormatting": modelessDialogShow(e.scriptPath+"paragraph.htm",460,284); break;
    case "btnListFormatting": modelessDialogShow(e.scriptPath+"list.htm",303,335); break;
    case "btnBoxFormatting": modelessDialogShow(e.scriptPath+"box.htm",498,395); break;
    case "btnCssText": modelessDialogShow(e.scriptPath+"styles_cssText.htm",360,352); break;
    case "btnCssBuilder": modelessDialogShow(e.scriptPath+"styles_cssText2.htm",430,445); break;
    case "btnForm0": modelessDialogShow(e.scriptPath+"form_form.htm", 280, 177); break;
    case "btnForm1": modelessDialogShow(e.scriptPath+"form_text.htm", 285, 289); break;
    case "btnForm2": modelessDialogShow(e.scriptPath+"form_list.htm", 295, 332); break;
    case "btnForm3": modelessDialogShow(e.scriptPath+"form_check.htm", 235, 174); break;
    case "btnForm4": modelessDialogShow(e.scriptPath+"form_radio.htm", 235, 177); break;
    case "btnForm5": modelessDialogShow(e.scriptPath+"form_hidden.htm", 235, 152); break;
    case "btnForm6": modelessDialogShow(e.scriptPath+"form_file.htm", 235, 132); break;
    case "btnForm7": modelessDialogShow(e.scriptPath+"form_button.htm", 235, 174); break;
    case "mnuTableSize": modelessDialogShow(e.scriptPath+"table_size.htm",240,282); break;
    case "mnuTableEdit": modelessDialogShow(e.scriptPath+"table_edit.htm",400,400); break;
    case "mnuCellEdit": modelessDialogShow(e.scriptPath+"table_editCell.htm",427,440); break;
    //case "btnPasteClip": e.doPaste(); break;
    case "btnPasteWord": modelessDialogShow(e.scriptPath+"paste_word.htm",400,280); break;
    case "btnPasteText": modelessDialogShow(e.scriptPath+"paste_text.htm",400,280); break;    
  }
  
  var idx=0;
  if(btn.indexOf("btnParagraphFormatting")!=-1) {
  } else
  if(btn.indexOf("btnParagraph")!=-1) {
    idx=btn.substr(btn.indexOf("_")+1);
    e.applyParagraph(e.arrParagraph[parseInt(idx)][1]);
  } else
  if(btn.indexOf("btnFontName")!=-1) {
    idx=btn.substr(btn.indexOf("_")+1);
    e.applyFontName(e.arrFontName[parseInt(idx)]);
  } else
  if(btn.indexOf("btnFontSize")!=-1) {
    idx=btn.substr(btn.indexOf("_")+1);
    e.applyFontSize(e.arrFontSize[parseInt(idx)][1]);
  } else
  if(btn.indexOf("btnCustomTag")!=-1) {
    idx=btn.substr(btn.indexOf("_")+1);
    e.insertCustomTag(parseInt(idx));
  }
};

function changeHeight(v) {
  
  var cH = String(this.height);
  var edtObj = document.getElementById("idArea" + this.oName);
  if(cH.indexOf("%") > -1) {
    cH = edtObj.childNodes[0].offsetHeight;
  }

  if (!this.minHeight) this.minHeight = parseInt(cH,10);

  var newHeight = parseInt(cH, 10) + v;
  
  //if(newHeight < this.minHeight) {
  //  if (this.minHeight) v = v + this.minHeight-newHeight;
  //  newHeight = this.minHeight;
  //}
  
  if(v<0) {

    var tbar = this.tbar;

    this.height = newHeight + "px";
    edtObj.style.height = this.height;

  
  } else if(v>0) {
    
    var tbar = this.tbar;
  
    this.height = newHeight + "px";
    edtObj.style.height = this.height;

  }
  


};
