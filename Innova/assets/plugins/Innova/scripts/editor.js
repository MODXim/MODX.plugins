/***********************************************************
InnovaStudio WYSIWYG Editor 5.1
© 2010, InnovaStudio (www.innovastudio.com). All rights reserved.
************************************************************/

var UA = navigator.userAgent.toLowerCase();
var isIE = (UA.indexOf('msie') >= 0) ? true : false;
var isNS = (UA.indexOf('mozilla') >= 0) ? true : false;

/*** UTILITY OBJECT ***/
var oUtil=new InnovaEditorUtil();
function InnovaEditorUtil()
  {
  /*** Localization ***/
  this.langDir="en-US";
  try{if(LanguageDirectory)this.langDir=LanguageDirectory;}catch(e){;}
  var oScripts=document.getElementsByTagName("script");
  for(var i=0;i<oScripts.length;i++)
    {
    var sSrc=oScripts[i].src.toLowerCase();
    if(sSrc.indexOf("scripts/editor.js")!=-1) this.scriptPath=oScripts[i].src.replace(/editor.js/ig,"");
    }
  this.scriptPathLang=this.scriptPath+"language/"+this.langDir+"/";
  if(this.langDir=="en-US")
    document.write("<scr"+"ipt src='"+this.scriptPathLang+"editor_lang.js'></scr"+"ipt>");
  /*** /Localization ***/

  this.oName;this.oEditor;this.obj;
  this.oSel;
  this.sType;
  this.bInside=bInside;
  this.useSelection=true;
  this.arrEditor=[];
  this.onSelectionChanged=function(){return true;};
  this.activeElement;
  this.activeModalWin;
  
  this.spcCharCode=[[169, "&copy;"],[163, "&pound;"],[174, "&reg;"],[233, "&eacute;"],[201, "&Eacute;"],[8364,"&euro;"],[8220,"\""]];
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
  
/*** FOCUS STUFF ***/
function bInside(oElement)
  {
  while(oElement!=null)
    {
    if(oElement.contentEditable=="true")return true;
    oElement=oElement.parentElement;
    }
  return false;
  };
function checkFocus()
  {
  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  var sType=oEditor.document.selection.type;

  if(oSel.parentElement!=null)
    {
    if(!bInside(oSel.parentElement()))return false;
    }
  else
    {
    if(!bInside(oSel.item(0)))return false;
    }
  return true;
  };
  
function iwe_focus()
  {
  var oEditor=eval("idContent"+this.oName);
  oEditor.focus();
  };
  
function set_focus()
  {
  var oEditor=eval("idContent"+this.oName);
  oEditor.focus();
  
    try {
      if(this.rangeBookmark!=null) {

        var oSel=oEditor.document.selection;
        var oRange = oSel.createRange();
        var bmRange = this.rangeBookmark;

        if(bmRange.parentElement()) {
          oRange.moveToElementText(bmRange.parentElement());
          oRange.setEndPoint("StarttoStart", bmRange);
          oRange.setEndPoint("EndToEnd", bmRange);
          oRange.select();
        }

      } else 
      if(this.controlBookmark!=null) {
        var oSel = oEditor.document.body.createControlRange();
        oSel.add(this.controlBookmark); oSel.select();
      }
      
    } catch(e) {}
  };
  
function bookmark_selection() {
    var oEditor=eval("idContent"+this.oName);
    var oSel=oEditor.document.selection;
    var oRange=oSel.createRange();
    
    if (oSel.type == "None" || oSel.type == "Text") {
      this.rangeBookmark = oRange;
      this.controlBookmark=null;
    } else {
      this.controlBookmark = oRange.item(0);
      this.rangeBookmark=null;
    }
  };

/*** EDITOR OBJECT ***/
function InnovaEditor(oName)
  {
  this.oName=oName;
  this.RENDER=RENDER;
  this.init=initISEditor;
  this.IsSecurityRestricted=false;

  this.loadHTML=loadHTML;
  this.putHTML=putHTML;
  this.getHTMLBody=getHTMLBody;
  this.getXHTMLBody=getXHTMLBody;
  this.getHTML=getHTML;
  this.getXHTML=getXHTML;
  this.getTextBody=getTextBody;
  this.initialRefresh=false;
  this.preserveSpace=false;

  this.bInside=bInside;
  this.checkFocus=checkFocus;
  this.focus=iwe_focus;
  this.setFocus=set_focus;
  this.bookmarkSelection=bookmark_selection;

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
  this.applyLine=applyLine;
  this.applyBold=applyBold;
  this.applyItalic=applyItalic;

  this.doOnPaste=doOnPaste;
  this.isAfterPaste=false;

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
  this.doPaste=doPaste;
  this.doPasteText=doPasteText;
  this.applySpan=applySpan;
  this.makeAbsolute=makeAbsolute;
  this.insertHTML=insertHTML;
  this.clearAll=clearAll;
  this.insertCustomTag=insertCustomTag;
  this.selectParagraph=selectParagraph;
  
  this.hide=hide;

  this.width="700";
  this.height="350";
  this.publishingPath="";//ex."../../../localhost/innovastudio/default.htm"

  var oScripts=document.getElementsByTagName("script");
  for(var i=0;i<oScripts.length;i++)
    {
    var sSrc=oScripts[i].src.toLowerCase();
    if(sSrc.indexOf("scripts/editor.js")!=-1) this.scriptPath=oScripts[i].src.replace(/editor.js/,"");
    }

  this.iconPath="icons/";
  this.iconWidth=29; //25;
  this.iconHeight=25; //22;
  this.iconOffsetTop;//not used

  this.dropTopAdjustment=-1;
  this.dropLeftAdjustment=0;
  this.heightAdjustment=-70;

  this.runtimeBorder=runtimeBorder;
  this.runtimeBorderOn=runtimeBorderOn;
  this.runtimeBorderOff=runtimeBorderOff;
  this.IsRuntimeBorderOn=true;
  this.runtimeStyles=runtimeStyles;

  this.applyColor=applyColor;
  this.customColors=[];//["#ff4500","#ffa500","#808000","#4682b4","#1e90ff","#9400d3","#ff1493","#a9a9a9"];
  this.oColor1 = new ColorPicker("oColor1",this.oName);//to call: oEdit1.oColor1
  this.oColor2 = new ColorPicker("oColor2",this.oName);//rendered id: ...oColor1oEdit1
  this.expandSelection=expandSelection;

  this.fullScreen=fullScreen;
  this.stateFullScreen=false;
  this.onFullScreen=function(){return true;};
  this.onNormalScreen=function(){return true;};

  this.arrElm=new Array(300);
  this.getElm=iwe_getElm;

  this.features=[];
  /*
  this.buttonMap=["Save","FullScreen","Preview","Print","Search","SpellCheck","|",
      "Cut","Copy","Paste","PasteWord","PasteText","|","Undo","Redo","|",
      "ForeColor","BackColor","|","Bookmark","Hyperlink",
      "Image","Flash","Media","ContentBlock","InternalLink","InternalImage","CustomObject","|",
      "Table","Guidelines","Absolute","|","Characters","Line",
      "Form","RemoveFormat","HTMLFullSource","HTMLSource","XHTMLFullSource",
      "XHTMLSource","ClearAll","BRK",
      "StyleAndFormatting","Styles","|","CustomTag","Paragraph","FontName","FontSize","|",
      "Bold","Italic","Underline","Strikethrough","Superscript","Subscript","|",
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
      "Bold","Italic","Underline","Strikethrough","Superscript","Subscript",
      "JustifyLeft","JustifyCenter","JustifyRight","JustifyFull",
      "Numbering","Bullets","Indent","Outdent","LTR","RTL"];//complete, default

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

  //*** CMS Features ***
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
  //*****

  this.css="";
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
            "Book Antiqua","Bookman Old Style",
            "Century Gothic","Comic Sans MS","Courier New",
            "Franklin Gothic Medium","Garamond","Georgia",
            "Impact","Lucida Console","Lucida Sans","Lucida Unicode",
            "Modern","Monotype Corsiva","Palatino Linotype",
            "Roman","Script","Small Fonts","Symbol",
            "Tahoma","Times New Roman","Trebuchet MS",
            "Verdana","Webdings","Wingdings","Wingdings 2","Wingdings 3",
            "serif","sans-serif","cursive","fantasy","monospace"];

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
  this.useBR=false;
  this.useDIV=true;

  this.doUndo=doUndo;
  this.doRedo=doRedo;
  this.saveForUndo=saveForUndo;
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
  
  this.spellCheckMode="ieSpell";//NetSpell
  
  this.encodeIO=false;
  this.changeHeight=changeHeight;
  
  this.rangeBookmark = null;
  this.controlBookmark = null;

  this.REPLACE=REPLACE;
  this.idTextArea;
  this.mode="XHTMLBody";
  
  var me=this;
  this.tbar=new ISToolbarManager(this.oName);
  this.tbar.iconPath = this.scriptPath+this.iconPath;
};

/*** UNDO/REDO ***/
function saveForUndo()
  {
  var oEditor=eval("idContent"+this.oName);
  var obj=eval(this.oName);
  if(obj.arrUndoList[0])
    if(oEditor.document.body.innerHTML==obj.arrUndoList[0][0])return;
  for(var i=20;i>1;i--)obj.arrUndoList[i-1]=obj.arrUndoList[i-2];
  obj.focus();
  var oSel=oEditor.document.selection.createRange();
  var sType=oEditor.document.selection.type;

  if(sType=="None")
    obj.arrUndoList[0]=[oEditor.document.body.innerHTML,
      oEditor.document.selection.createRange().getBookmark(),"None"];
  else if(sType=="Text")
    obj.arrUndoList[0]=[oEditor.document.body.innerHTML,
      oEditor.document.selection.createRange().getBookmark(),"Text"];
  else if(sType=="Control")
    {
    oSel.item(0).selThis="selThis";
    obj.arrUndoList[0]=[oEditor.document.body.innerHTML,null,"Control"];
    oSel.item(0).removeAttribute("selThis",0);
    }
  this.arrRedoList=[];//clear redo list

  if(this.btnUndo) this.tbar.btns["btnUndo"+this.oName].setState(1);//makeEnableNormal(eval("document.all.btnUndo"+this.oName));
  if(this.btnRedo) this.tbar.btns["btnRedo"+this.oName].setState(5);//makeDisabled(eval("document.all.btnRedo"+this.oName));
  };
  
function doUndo()
  {
  var oEditor=eval("idContent"+this.oName);
  var obj=eval(this.oName);
  if(!obj.arrUndoList[0])return;
  //~~~~
  for(var i=20;i>1;i--)obj.arrRedoList[i-1]=obj.arrRedoList[i-2];
  var oSel=oEditor.document.selection.createRange();
  var sType=oEditor.document.selection.type;
  if(sType=="None")
    this.arrRedoList[0]=[oEditor.document.body.innerHTML,
      oEditor.document.selection.createRange().getBookmark(),"None"];
  else if(sType=="Text")
    this.arrRedoList[0]=[oEditor.document.body.innerHTML,
      oEditor.document.selection.createRange().getBookmark(),"Text"];
  else if(sType=="Control")
    {
    oSel.item(0).selThis="selThis";
    this.arrRedoList[0]=[oEditor.document.body.innerHTML,null,"Control"];
    oSel.item(0).removeAttribute("selThis",0);
    }
  //~~~~
  sHTML=obj.arrUndoList[0][0];
  sHTML=fixPathEncode(sHTML);
  oEditor.document.body.innerHTML=sHTML;
  fixPathDecode(oEditor);

  //*** RUNTIME STYLES ***
  this.runtimeBorder(false);
  this.runtimeStyles();
  //***********************
  var oRange=oEditor.document.body.createTextRange();
  if(obj.arrUndoList[0][2]=="None")
    {
    oRange.moveToBookmark(obj.arrUndoList[0][1]);
    oRange.select(); //di-disable, spy tdk select all? tdk perlu utk undo
    }
  else if(obj.arrUndoList[0][2]=="Text")
    {
    oRange.moveToBookmark(obj.arrUndoList[0][1]);
    oRange.select();
    }
  else if(obj.arrUndoList[0][2]=="Control")
    {
    for(var i=0;i<oEditor.document.all.length;i++)
      {
      if(oEditor.document.all[i].selThis=="selThis")
        {
        var oSelRange=oEditor.document.body.createControlRange();
        oSelRange.add(oEditor.document.all[i]);
        oSelRange.select();
        oEditor.document.all[i].removeAttribute("selThis",0);
        }
      }
    }
  //~~~~
  for(var i=0;i<19;i++)obj.arrUndoList[i]=obj.arrUndoList[i+1];
  obj.arrUndoList[19]=null;
  realTime(this.oName);
  };
function doRedo()
  {
  var oEditor=eval("idContent"+this.oName);
  var obj=eval(this.oName);
  if(!obj.arrRedoList[0])return;
  //~~~~
  for(var i=20;i>1;i--)obj.arrUndoList[i-1]=obj.arrUndoList[i-2];
  var oSel=oEditor.document.selection.createRange();
  var sType=oEditor.document.selection.type;
  if(sType=="None")
    obj.arrUndoList[0]=[oEditor.document.body.innerHTML,
      oEditor.document.selection.createRange().getBookmark(),"None"];
  else if(sType=="Text")
    obj.arrUndoList[0]=[oEditor.document.body.innerHTML,
      oEditor.document.selection.createRange().getBookmark(),"Text"];
  else if(sType=="Control")
    {
    oSel.item(0).selThis="selThis";
    this.arrUndoList[0]=[oEditor.document.body.innerHTML,null,"Control"];
    oSel.item(0).removeAttribute("selThis",0);
    }
  //~~~~
  sHTML=obj.arrRedoList[0][0];
  sHTML=fixPathEncode(sHTML);
  oEditor.document.body.innerHTML=sHTML;
  fixPathDecode(oEditor);
  
  //*** RUNTIME STYLES ***
  this.runtimeBorder(false);
  this.runtimeStyles();
  //***********************
  var oRange=oEditor.document.body.createTextRange();
  if(obj.arrRedoList[0][2]=="None")
    {
    oRange.moveToBookmark(obj.arrRedoList[0][1]);
    //oRange.select(); //di-disable, sph tdk select all, utk redo perlu
    }
  else if(obj.arrRedoList[0][2]=="Text")
    {
    oRange.moveToBookmark(obj.arrRedoList[0][1]);
    oRange.select();
    }
  else if(obj.arrRedoList[0][2]=="Control")
    {
    for(var i=0;i<oEditor.document.all.length;i++)
      {
      if(oEditor.document.all[i].selThis=="selThis")
        {
        var oSelRange = oEditor.document.body.createControlRange();
        oSelRange.add(oEditor.document.all[i]);
        oSelRange.select();
        oEditor.document.all[i].removeAttribute("selThis",0);
        }
      }
    }
  //~~~~
  for(var i=0;i<19;i++)obj.arrRedoList[i]=obj.arrRedoList[i+1];
  obj.arrRedoList[19]=null;
  realTime(this.oName);
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
    
    var oEditor=eval("idContent"+oEdit.oName);
    var allSpans = oEditor.document.getElementsByTagName("SPAN");
    for (var j=0; j<allSpans.length; j++)
      {
      if ((allSpans[j].innerHTML=="") && (allSpans[j].parentElement.children.length==1))
        {
        allSpans[j].innerHTML = "&nbsp;";
        }
      }

    if(oEdit.mode=="HTMLBody")sContent=oEdit.getHTMLBody();
    if(oEdit.mode=="HTML")sContent=oEdit.getHTML();
    if(oEdit.mode=="XHTMLBody")sContent=oEdit.getXHTMLBody();
    if(oEdit.mode=="XHTML")sContent=oEdit.getXHTML();
    document.getElementById(oEdit.idTextArea).value=sContent;
    }
  if(onsubmit_original)return onsubmit_original();
  };
function onsubmit_original(){};

var iconHeight;//icons related
function RENDER(sPreloadHTML, dvId)
  {
  
  if(document.compatMode && document.compatMode!="BackCompat") {
    if(String(this.height).indexOf("%") == -1) {
      var eh = parseInt(this.height, 10);
      eh += this.heightAdjustment;
      this.height = eh + "px";
    }
  }
  
  iconHeight=this.iconHeight;//icons related

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
  
  /*---------------*/
  /*Color picker   */
  /*---------------*/
  
  //Render Color Picker (forecolor)
  this.oColor1.url=this.scriptPath+"color_picker_fg.htm";
  this.oColor1.onShow = new Function(this.oName+".hide()");
  this.oColor1.onMoreColor = new Function(this.oName+".hide()");
  this.oColor1.onPickColor = new Function(this.oName+".applyColor('ForeColor',eval('"+this.oName+"').oColor1.color)");
  this.oColor1.onRemoveColor = new Function(this.oName+".applyColor('ForeColor','')");
  this.oColor1.txtCustomColors=getTxt("Custom Colors");
  this.oColor1.txtMoreColors=getTxt("More Colors...");

  //Render Color Picker (backcolor)
  this.oColor2.url=this.scriptPath+"color_picker_bg.htm";
  this.oColor2.onShow = new Function(this.oName+".hide()");
  this.oColor2.onMoreColor = new Function(this.oName+".hide()");
  this.oColor2.onPickColor = new Function(this.oName+".applyColor('BackColor',eval('"+this.oName+"').oColor2.color)");
  this.oColor2.onRemoveColor = new Function(this.oName+".applyColor('BackColor','')");
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
      tmpTb.iconPath=this.scriptPath+this.iconPath;
      tmpTb.btnWidth=this.iconWidth;
      tmpTb.btnHeight=this.iconHeight;
      
      for (var j=0;j<tmp[2].length;j++) {
        eval(this.oName+".btn"+tmp[2][j]+"=true");
      }
      buildToolbar(tmpTb, this, tmp[2]);
      grpMap[tmp[0]]=tmp[1];
    }
  
    //create tab and groups
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
      orTb.iconPath=this.scriptPath+this.iconPath;
      orTb.btnWidth=this.iconWidth;
      orTb.btnHeight=this.iconHeight;
      buildToolbar(orTb, this, this.buttonMap);
  }
  
  var sHTML="";

  sHTML+="<iframe name=idFixZIndex"+this.oName+" id=idFixZIndex"+this.oName+"  frameBorder=0 style='display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)' src='"+this.scriptPath+"blank.gif' ></iframe>"; //src='javascript:;'
  sHTML+="<table id=idArea"+this.oName+" name=idArea"+this.oName+" border=0 "+
    "cellpadding=0 cellspacing=0 width='"+this.width+"' height='"+this.height+"' style='border-bottom:#cfcfcf 1px solid'>"+
    "<tr><td colspan=2 style=\"position:relative;padding:0px;padding-left:0px;border:#cfcfcf 0px solid;border-bottom:0;background:url('"+this.scriptPath+"icons/bg.gif')\">"+
    "<table cellpadding=0 cellspacing=0 width='100%'><tr><td dir=ltr style='padding:0px'>"+
    this.tbar.render()+
    "</td></tr></table>"+
    "</td></tr>"+
    "<tr id=idTagSelTopRow"+this.oName+"><td colspan=2 id=idTagSelTop"+this.oName+" height=0 style='padding:0px'></td></tr>";

  sHTML+="<tr><td colspan=2 valign=top height=100% style='padding:0px;background:white;'>";

  sHTML+="<table cellpadding=0 cellspacing=0 width=100% height=100%><tr><td width=100% height=100% style='padding:0px;border:#cfcfcf 1px solid;border-bottom:none'>";//StyleSelect

  if(this.IsSecurityRestricted)
    sHTML+="<iframe security='restricted' style='width:100%;height:100%;' src='"+this.scriptPath+"blank.gif'"+
      " name=idContent"+ this.oName + " id=idContent"+this.oName+
      " contentEditable=true></iframe>";//prohibit running ActiveX controls
  else
    sHTML+="<iframe style='width:100%;height:100%;' frameborder='no' style='' src='"+this.scriptPath+"blank.gif'"+
      " name=idContent"+ this.oName + " id=idContent"+this.oName+
      " contentEditable=true></iframe>";

  //Paste From Word
  sHTML+="<iframe style='width:1px;height:1px;overflow:auto;' src='"+this.scriptPath+"blank.gif'"+
    " name=idContentWord"+ this.oName +" id=idContentWord"+ this.oName+
    " contentEditable=true onfocus='"+this.oName+".hide()'></iframe>";

  sHTML+="</td><td id=idStyles"+this.oName+" style='padding:0px;background:#f4f4f4' valign=top></td></tr></table>";//StyleSelect

  sHTML+="</td></tr>";
  sHTML+="<tr id=idTagSelBottomRow"+this.oName+"><td colspan=2 id=idTagSelBottom"+this.oName+" style='padding:0px;'></td></tr>";
  
  if(this.showResizeBar) {
    sHTML+="<tr id=idResizeBar"+this.oName+"><td colspan=2 style='padding:0px;'><div class='resize_bar' style='cursor:n-resize;' onmousedown=\"onEditorStartResize(event, this, '"+this.oName+"')\" ></div></td></tr>";
  }
  
  sHTML+="</table>";

  sHTML+=sHTMLDropMenus;//dropdown
  
  sHTML+="<input type=submit name=iwe_btnSubmit"+this.oName+" id=iwe_btnSubmit"+this.oName+" value=SUBMIT style='display:none' >";//hidden submit button

  //initalize floating window
  //var dialogWin = new ISFloatFrame("isWin" + this.oName);
  //sHTML+=dialogWin.render({defaultUrl:this.scriptPath+"hyperlink2.htm"});  

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

  this.init();
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
  
};

function onEditorStopResize() {

  oUtil.resizeOffset = {dx:event.screenX-oUtil.resizeInit.x, dy:event.screenY-oUtil.resizeInit.y};
  oUtil.currentResized.changeHeight(oUtil.resizeOffset.dy);

  oUtil.isWindow.hideOverlay();

  document.onmousemove=null;
  document.onmouseup=null;
  document.body.style.cursor="default";
};

function onEditorResize() {
  
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
    this.moveTagSelector();
    }

  //paste from word temp storage
  /*var oWord=eval("idContentWord"+this.oName);
  oWord.document.designMode="on";
  oWord.document.open("text/html","replace");
  oWord.document.write("<html><head></head><body></body></html>");
  oWord.document.close();
  oWord.document.body.contentEditable=true;*/

  oUtil.oName=this.oName;//default active editor
  oUtil.oEditor=eval("idContent"+this.oName);
  oUtil.oEditor.document.designMode="on";
  oUtil.obj=eval(this.oName);

  oUtil.arrEditor.push(this.oName);

  //Normalize button position if the editor is placed in relative positioned element
  eval("idArea"+this.oName).style.position="absolute";
  window.setTimeout("eval('idArea"+this.oName+"').style.position='';",1);

  var arrA = String(this.preloadHTML).match(/<HTML[^>]*>/ig);
  if(arrA)
    {//full html
    this.loadHTML("");
    //this.preloadHTML is required here. Can't use sPreloadHTML as in:
    //window.setTimeout(this.oName+".putHTML("+sPreloadHTML+")",0);
    window.setTimeout(this.oName+".putHTML("+this.oName+".preloadHTML)",0);
    //window.setTimeout utk fix swf loading.
    //Utk loadHTML & putHTML yg di SourceEditor tdk masalah
    }
  else
    {
    this.loadHTML(this.preloadHTML)
    }
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
          tb.addButton("btnSpellCheck"+oName, "btnSpellCheck.gif",getTxt("Check Spelling"));
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
          tb.addDropdownButton("btnFontName"+oName,"ddFontName"+oName, "btnFontName.gif",getTxt("Font Name"),37);
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
      case "Cut":
        if(oEdt.btnCut)tb.addButton("btnCut"+oName,"btnCut.gif",getTxt("Cut"));
        break;
      case "Copy":
        if(oEdt.btnCopy)tb.addButton("btnCopy"+oName,"btnCopy.gif",getTxt("Copy"));
        break;

      case "Paste":
          if(oEdt.btnPaste || oEdt.btnPasteWord || oEdt.btnPasteText) {
            tb.addDropdownButton("btnPaste"+oName, "ddPaste"+oName, "btnPaste.gif",getTxt("Paste"));
            var pvDD=new ISDropdown("ddPaste"+oName); 
            pvDD.iconPath = tb.iconPath;
            if(oEdt.btnPaste) pvDD.addItem("btnPasteClip"+oName, getTxt("Paste"), "btnPasteClip.gif");
            if(oEdt.btnPasteWord) pvDD.addItem("btnPasteWord"+oName, getTxt("Paste from Word"), "btnPasteWord.gif");
            if(oEdt.btnPasteText) pvDD.addItem("btnPasteText"+oName, getTxt("Paste Text"), "btnPasteText.gif");
            pvDD.onClick=function(id) {ddAction(tb, id, oEdt, oEdt.oName)};
          }
        break;
        
      //case "Paste":
      //  if(oEdt.btnPaste)tb.addButton("btnPaste"+oName,"btnPaste.gif",getTxt("Paste"));
      //  break;
      //case "PasteWord":
      //  if(oEdt.btnPasteWord)tb.addButton("btnPasteWord"+oName,"btnPasteWord.gif",getTxt("Paste from Word"));
      //  break;
      //case "PasteText":
      //  if(oEdt.btnPasteText)tb.addButton("btnPasteText"+oName,"btnPasteText.gif",getTxt("Paste Text"));
      //  break;
      case "Undo":
        if(oEdt.btnUndo)tb.addButton("btnUndo"+oName,"btnUndo.gif",getTxt("Undo"));
        break;
      case "Redo":
        if(oEdt.btnRedo)tb.addButton("btnRedo"+oName,"btnRedo.gif",getTxt("Redo"));
        break;
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
          sdd[sZ++]="<table width=195 id=dropTableCreate"+oName+" onmouseout='doOut_TabCreate();event.cancelBubble=true' style='cursor:default;background:#f3f3f8;border:#8a867a 0px solid;' cellpadding=0 cellspacing=2 border=0 unselectable=on>";
          for(var m=0;m<8;m++)
            {
            sdd[sZ++]="<tr>";
            for(var n=0;n<8;n++)
              {
              sdd[sZ++]="<td onclick='"+oName+".doClick_TabCreate()' onmouseover='doOver_TabCreate()' style='background:#ffffff;font-size:1px;border:#8a867a 1px solid;width:20px;height:20px;' unselectable=on>&nbsp;</td>";
              }
            sdd[sZ++]="</tr>";
            }
          sdd[sZ++]="<tr><td colspan=8 onclick=\""+oName+".hide();modelessDialogShow('"+oEdt.scriptPath+"table_insert.htm',320,362);\" onmouseover=\"this.innerText='"+getTxt("Advanced Table Insert")+"';this.style.border='#777777 1px solid';this.style.backgroundColor='#444444';this.style.color='#ffffff'\" onmouseout=\"this.style.border='#f3f3f8 1px solid';this.style.backgroundColor='#f3f3f8';this.style.color='#000000'\" align=center style='font-family:verdana;font-size:10px;font-color:black;border:#f3f3f8 1px solid;' unselectable=on>"+getTxt("Advanced Table Insert")+"</td></tr>";
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
      case "Guidelines":
        if(oEdt.btnGuidelines)tb.addButton("btnGuidelines"+oName,"btnGuideline.gif",getTxt("Show/Hide Guidelines"));
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

/*** COLOR PICKER ***/
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
  var sHTMLColor="<table id=dropColor"+this.oRenderName+" style=\"z-index:1;display:none;position:absolute;border:#9b95a6 1px solid;cursor:default;background-color:#f4f4f4;padding:2px\" unselectable=on cellpadding=0 cellspacing=0 width=143 height=109><tr><td unselectable=on style='padding:0px;'>";
  sHTMLColor+="<table align=center cellpadding=0 cellspacing=0 border=0 unselectable=on>";
  for(var i=0;i<arrColors.length;i++)
    {
    sHTMLColor+="<tr>";
    for(var j=0;j<arrColors[i].length;j++)
      sHTMLColor+="<td onclick=\""+this.oName+".color='"+arrColors[i][j]+"';"+this.oName+".onPickColor();"+this.oName+".currColor='"+arrColors[i][j]+"';"+this.oName+".hideAll()\" onmouseover=\"this.style.border='#777777 1px solid'\" onmouseout=\"this.style.border='#f4f4f4 1px solid'\" style=\"cursor:default;padding:1px;border:#f4f4f4 1px solid;\" unselectable=on>"+
        "<table style='margin:0;width:13px;height:13px;background:"+arrColors[i][j]+";border:white 1px solid' cellpadding=0 cellspacing=0 unselectable=on>"+
        "<tr><td unselectable=on></td></tr>"+
        "</table></td>";
    sHTMLColor+="</tr>";
    }

  //~~~ custom colors ~~~~
  sHTMLColor+="<tr><td colspan=8 id=idCustomColor"+this.oRenderName+" style='padding:0px;'></td></tr>";

  //~~~ remove color & more colors ~~~~
  sHTMLColor+= "<tr>";
  sHTMLColor+= "<td unselectable=on style='padding:0px;'>"+
    "<table style='margin-left:1px;width:14px;height:14px;background:#f4f4f4;' cellpadding=0 cellspacing=0 unselectable=on>"+
    "<tr><td onclick=\""+this.oName+".onRemoveColor();"+this.oName+".currColor='';"+this.oName+".hideAll()\" onmouseover=\"this.style.border='#777777 1px solid'\" onmouseout=\"this.style.border='white 1px solid'\" style=\"cursor:default;padding:1px;border:white 1px solid;font-family:verdana;font-size:10px;font-color:black;line-height:9px;\" align=center valign=top unselectable=on>x</td></tr>"+
    "</table></td>";
  sHTMLColor+= "<td colspan=7 unselectable=on style='padding:0px;'>"+
    "<table style='margin:1px;width:117px;height:16px;background:#f4f4f4;border:white 1px solid' cellpadding=0 cellspacing=0 unselectable=on>"+
    "<tr><td onclick=\""+this.oName+".onMoreColor();"+this.oName+".hideAll();modelessDialogShow('"+this.url+"',428,420, window,{'oName':'"+this.oName+"'});\" onmouseover=\"this.style.border='#777777 1px solid';this.style.background='#444444';this.style.color='#ffffff'\" onmouseout=\"this.style.border='#f4f4f4 1px solid';this.style.background='#f4f4f4';this.style.color='#000000'\" style=\"cursor:default;padding:1px;border:#efefef 1px solid\" style=\"font-family:verdana;font-size:9px;font-color:black;line-height:9px;padding:1px\" align=center valign=top nowrap unselectable=on>"+this.txtMoreColors+"</td></tr>"+
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
    eval("idCustomColor"+this.oRenderName).innerHTML="";
    return;
    }
  sHTML="<table cellpadding=0 cellspacing=0 width=100%><tr><td colspan=8 style=\"font-family:verdana;font-size:9px;font-color:black;line-height:9px;padding:1\">"+this.txtCustomColors+":</td></tr></table>";
  sHTML+="<table cellpadding=0 cellspacing=0><tr>";
  for(var i=0;i<this.customColors.length;i++)
    {
    if(i<22)
      {
      if(i==8||i==16||i==24||i==32)sHTML+="</tr></table><table cellpadding=0 cellspacing=0><tr>";
      sHTML+="<td onclick=\""+this.oName+".color='"+this.customColors[i]+"';"+this.oName+".onPickColor()\" onmouseover=\"this.style.border='#777777 1px solid'\" onmouseout=\"this.style.border='#f4f4f4 1px solid'\" style=\"cursor:default;padding:1px;border:#f4f4f4 1px solid;\" unselectable=on>"+
        " <table  style='margin:0;width:13px;height:13px;background:"+this.customColors[i]+";border:white 1px solid' cellpadding=0 cellspacing=0 unselectable=on>"+
        " <tr><td unselectable=on></td></tr>"+
        " </table>"+
        "</td>";
      }
    }
  sHTML+="</tr></table>";
  eval("idCustomColor"+this.oRenderName).innerHTML=sHTML;
  };
function showColorPicker(oEl)
  {
  this.onShow();
  this.hideAll();
  var box=eval("dropColor"+this.oRenderName);
  box.style.display="block";
  var nTop=0;
  var nLeft=0;

  oElTmp=oEl;
  while(oElTmp)
    {
    nLeft+=oElTmp.offsetLeft;
    nTop+=oElTmp.offsetTop;
    oElTmp = oElTmp.offsetParent;
    }

  //if scroll.
  var scrX = document.body.scrollLeft || document.documentElement.scrollLeft;
  var scrY = document.body.scrollTop || document.documentElement.scrollTop;
  
  if(this.align=="left") box.style.left=nLeft+oUtil.obj.dropLeftAdjustment + "px";
  else box.style.left=nLeft-143+oEl.offsetWidth+oUtil.obj.dropLeftAdjustment + "px";

  box.style.top=nTop+25+1+oUtil.obj.dropTopAdjustment + "px";//[CUSTOM]

  box.style.zIndex=1000000;

  this.isActive=true;
  this.refreshCustomColor();
  };
function hideColorPicker()
  {
  this.onHide();
  var box=eval("dropColor"+this.oRenderName);
  box.style.display="none";
  this.isActive=false;
  };
function hideColorPickerAll()
  {
  for(var i=0;i<arrColorPickerObjects.length;i++)
    {
    var box=eval("dropColor"+eval(arrColorPickerObjects[i]).oRenderName);
    box.style.display="none";
    eval(arrColorPickerObjects[i]).isActive=false;
    }
  };

/*** CONTENT ***/
function loadHTML(sHTML)//hanya utk first load.
  {
  var oEditor=eval("idContent"+this.oName);
  
  /*** Apply this.css to the content ***/
  var sStyle="";
  if(this.css!="") sStyle="<link href='"+this.css+"' rel='stylesheet' type='text/css'>";

  var oDoc=oEditor.document.open("text/html","replace");
  if(this.publishingPath!="")
    {
    var arrA = String(this.preloadHTML).match(/<base[^>]*>/ig);
    if(!arrA)
      {//if no <base> found
      sHTML=this.docType+"<HTML><HEAD><BASE HREF=\""+this.publishingPath+"\"/>"+this.headContent+sStyle+"</HEAD><BODY contentEditable=true>" + sHTML + "</BODY></HTML>";
      //kalau cuma tambah <HTML><HEAD></HEAD><BODY.. tdk apa2.
      }
    }
  else
    {
    sHTML=this.docType+"<HTML><HEAD>"+this.headContent+sStyle+"</HEAD><BODY contentEditable=true>"+sHTML+"</BODY></HTML>";
    }
  oDoc.write(sHTML);
  oDoc.close();

  oEditor.document.body.contentEditable=true;
  oEditor.document.execCommand("2D-Position", true, true);//make focus
  oEditor.document.execCommand("MultipleSelection", true, true);//make focus
  oEditor.document.execCommand("LiveResize", true, true);//make focus

  //RealTime
  oEditor.document.body.onkeyup = new Function("editorDoc_onkeyup('"+this.oName+"')");
  oEditor.document.body.onmouseup = new Function("editorDoc_onmouseup('"+this.oName+"')");

  //<br> or <p>
  oEditor.document.body.onkeydown=new Function("doKeyPress(eval('idContent"+this.oName+"').event,'"+this.oName+"')");

  //*** RUNTIME STYLES ***
  this.runtimeBorder(false);
  this.runtimeStyles();
  //***********************
  
  //Save for Undo
  oEditor.document.body.onpaste = new Function("return "+this.oName+".doOnPaste()");
  oEditor.document.body.oncut = new Function(this.oName+".saveForUndo()");

  //fix undisplayed content (new)
  oEditor.document.body.style.lineHeight="1.2";
  oEditor.document.body.style.lineHeight="";

  //fix undisplayed content (old)
  if(this.initialRefresh)
    {
    oEditor.document.execCommand("SelectAll");
    window.setTimeout("eval('idContentWord"+this.oName+"').document.execCommand('SelectAll');",0);
    }

  /*** Apply this.arrStyle to the content ***/
  if(this.arrStyle.length>0)
    {
    var oElement=oEditor.document.createElement("<STYLE>");
    var n=oEditor.document.styleSheets.length;
    oEditor.document.documentElement.childNodes[0].appendChild(oElement);
    for(var i=0;i<this.arrStyle.length;i++)
      {
      selector=this.arrStyle[i][0];
      style=this.arrStyle[i][3];
      oEditor.document.styleSheets(n).addRule(selector,style);
      }
    }

  this.cleanDeprecated();
  };

function putHTML(sHTML)//used by source editor
  {
  var oEditor=eval("idContent"+this.oName);

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
  
  var oDoc=oEditor.document.open("text/html","replace");
  oDoc.write(sHTML);
  oDoc.close();
  oEditor.document.body.contentEditable=true;
  //oEditor.document.body.onload=new Function("eval('idContent"+this.oName+"').document.body.contentEditable=true");
  oEditor.document.execCommand("2D-Position",true,true);
  oEditor.document.execCommand("MultipleSelection",true,true);
  oEditor.document.execCommand("LiveResize",true,true);

  //RealTime
  //oEditor.document.body.onkeydown=new Function("editorDoc_onkeydown('"+this.oName+"')");
  oEditor.document.body.onkeyup=new Function("editorDoc_onkeyup('"+this.oName+"')");
  oEditor.document.body.onmouseup=new Function("editorDoc_onmouseup('"+this.oName+"')");

  //<br> or <p>
  oEditor.document.body.onkeydown=new Function("doKeyPress(eval('idContent"+this.oName+"').event,'"+this.oName+"')");

  //*** RUNTIME STYLES ***
  this.runtimeBorder(false);
  this.runtimeStyles();
  //***********************
  
  /*** No need to apply this.css or this.arrStyle to the content 
  assuming that the content has stylesheet applied.
  ***/

  this.cleanDeprecated();
  };

function encodeHTMLCode(sHTML) {
  return sHTML.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
};

function getTextBody()
  {
  var oEditor=eval("idContent"+this.oName);
  return oEditor.document.body.innerText;
  };
function getHTML()
  {
  var oEditor=eval("idContent"+this.oName);
  this.cleanDeprecated();

  sHTML=oEditor.document.documentElement.outerHTML;
  sHTML=String(sHTML).replace(/ contentEditable=true/g,"");
  sHTML = String(sHTML).replace(/\<PARAM NAME=\"Play\" VALUE=\"0\">/ig,"<PARAM NAME=\"Play\" VALUE=\"-1\">");
  sHTML=this.docType+sHTML;//restore doctype (if any)
  sHTML=oUtil.replaceSpecialChar(sHTML);
  sHTML = sHTML.replace(/align=['"]*middle['"]*/gi, "align=\"center\"");
  if(this.encodeIO) sHTML=encodeHTMLCode(sHTML);
  return sHTML;
  };
function getHTMLBody()
  {
  var oEditor=eval("idContent"+this.oName);
  this.cleanDeprecated();

  sHTML=oEditor.document.body.innerHTML;
  sHTML=String(sHTML).replace(/ contentEditable=true/g,"");
  sHTML = String(sHTML).replace(/\<PARAM NAME=\"Play\" VALUE=\"0\">/ig,"<PARAM NAME=\"Play\" VALUE=\"-1\">");
  sHTML=oUtil.replaceSpecialChar(sHTML);
  sHTML = sHTML.replace(/align=['"]*middle['"]*/gi, "align=\"center\"");  
  if(this.encodeIO) sHTML=encodeHTMLCode(sHTML);
  return sHTML;
  };
var sBaseHREF="";
function getXHTML()
  {
  var oEditor=eval("idContent"+this.oName);
  this.cleanDeprecated();

  //base handling
  sHTML=oEditor.document.documentElement.outerHTML;
  var arrTmp=sHTML.match(/<BASE([^>]*)>/ig);
  if(arrTmp!=null)sBaseHREF=arrTmp[0];
  for(var i=0;i<oEditor.document.all.length;i++)
    if(oEditor.document.all[i].tagName=="BASE")oEditor.document.all[i].removeNode();
  for(var i=0;i<oEditor.document.all.length;i++)
    if(oEditor.document.all[i].tagName=="BASE")oEditor.document.all[i].removeNode();
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
  sHTML=sHTML.replace(/<\/title>/,"<\/title>"+sBaseHREF);//restore base href
  sHTML=oUtil.replaceSpecialChar(sHTML);
  sHTML = sHTML.replace(/align=['"]*middle['"]*/gi, "align=\"center\"");
  if(this.encodeIO) sHTML=encodeHTMLCode(sHTML);
  return sHTML;
  };
function getXHTMLBody()
  {
  var oEditor=eval("idContent"+this.oName);
  this.cleanDeprecated();

  //base handling
  sHTML=oEditor.document.documentElement.outerHTML;
  var arrTmp=sHTML.match(/<BASE([^>]*)>/ig);
  if(arrTmp!=null)sBaseHREF=arrTmp[0];
  for(var i=0;i<oEditor.document.all.length;i++)
    if(oEditor.document.all[i].tagName=="BASE")oEditor.document.all[i].removeNode();
  for(var i=0;i<oEditor.document.all.length;i++)
    if(oEditor.document.all[i].tagName=="BASE")oEditor.document.all[i].removeNode();
  //~~~~~~~~~~~~~

  sHTML=recur(oEditor.document.body,"");
  sHTML=oUtil.replaceSpecialChar(sHTML);
  sHTML = sHTML.replace(/align=['"]*middle['"]*/gi, "align=\"center\"");
  if(this.encodeIO) sHTML=encodeHTMLCode(sHTML);
  return sHTML;
  };

function ApplyExternalStyle(oName)
  { 
  var oEditor=eval("idContent"+oName);
  var sTmp="";
  for(var j=0;j<oEditor.document.styleSheets.length;j++)
    {
    var myStyle=oEditor.document.styleSheets(j);

    //In full HTML editing: this will parse linked & embedded stylesheet
    //In Body content editing: this will parse all embedded/applied css & arrStyle.
    for(var i=0;i<myStyle.rules.length;i++)
      {
      sSelector=myStyle.rules.item(i).selectorText; 
      sCssText=myStyle.rules.item(i).style.cssText.replace(/"/g,"&quot;");
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
  var edtObj = eval(oName);
  for(var i=0; i<arrStyle.length; i++) {
    for(var j=0; j<edtObj.arrStyle.length; j++) {
      if(arrStyle[i][0].toLowerCase()==edtObj.arrStyle[j][0].toLowerCase()) {
      arrStyle[i][1]=edtObj.arrStyle[j][1];
      }
    }
  }
  
  edtObj.arrStyle=arrStyle;//Update arrStyle property
  };

function doApplyStyle(oName,sClassName)
  {
  //Focus stuff
  if(!eval(oName).checkFocus())return;
  
  var oEditor=eval("idContent"+oName);
  var oSel=oEditor.document.selection.createRange();

  eval(oName).saveForUndo();

  if(oUtil.activeElement)
    {
    oElement=oUtil.activeElement;
    oElement.className=sClassName;
    }
  else if (oSel.parentElement)  
    {
    if(oSel.text=="")
      {
      oElement=oSel.parentElement();
      if(oElement.tagName=="BODY")return;
      oElement.className=sClassName;
      }
    else
      {
      //var idNewSpan=eval(oName).applySpan();
      //if(idNewSpan)idNewSpan.className=sClassName;
      eval(oName).applySpanStyle([],sClassName);
      }
    }
  else 
    {
    oElement=oSel.item(0);
    oElement.className=sClassName;
    }
  realTime(oName);
  };
function openStyleSelect()
  {
  if(!this.isCssLoaded)ApplyExternalStyle(this.oName);
  this.isCssLoaded=true;//make only 1 call to ApplyExternalStyle()

  var bShowStyles=false;
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
  sHTML+="<div unselectable=on style='width:200px;margin:1px;margin-top:0;margin-right:2px;' align=right>";
  sHTML+="<table style='margin-right:1px;margin-bottom:3px;width:14px;height:14px;background:#f4f4f4;' cellpadding=0 cellspacing=0 unselectable=on>"+
    "<tr><td onclick=\""+this.oName+".openStyleSelect();\" onmouseover=\"this.style.border='#708090 1px solid';this.style.color='white';this.style.backgroundColor='9FA7BB'\" onmouseout=\"this.style.border='white 1px solid';this.style.color='black';this.style.backgroundColor=''\" style=\"cursor:default;padding:1px;border:white 1px solid;font-family:verdana;font-size:10px;font-color:black;line-height:9px;\" align=center valign=top unselectable=on>x</td></tr>"+
    "</table></div>";

  var sBody="";
  for(var i=0;i<arrStyle.length;i++)
    {
    sSelector=arrStyle[i][0];
    if(sSelector=="BODY")sBody=arrStyle[i][3];
    }

  sHTML+="<div unselectable=on style='overflow:auto;width:200px;height:"+h+"px;padding-left:3px;'>";
  sHTML+="<table name='tblStyles"+this.oName+"' id='tblStyles"+this.oName+"' cellpadding=0 cellspacing=0 style='background:#fcfcfc;"+sBody+";width:100%;height:100%;margin:0;'>";

  for(var i=0;i<arrStyle.length;i++)
    {
    sSelector=arrStyle[i][0];
    isOnSelection=arrStyle[i][1];
    
    sCssText=arrStyle[i][3];
    
    //sCssText=sCssText.replace(/COLOR: rgb\(255,255,255\)/,"COLOR: #000000");
    //sCssText=sCssText.replace(/COLOR: #ffffff/,"COLOR: #000000");
    //sCssText=sCssText.replace(/COLOR: white/,"COLOR: #000000");
    
    sCaption=arrStyle[i][2];
    if(isOnSelection)
      {
      if(sSelector.split(".").length>1)//sudah pasti
        {
        var tmpSelector = sSelector;
        if (sSelector.indexOf(":")>0) tmpSelector = sSelector.substring(0, sSelector.indexOf(":"));
        bShowStyles=true;
        sHTML+="<tr style=\"cursor:default\" onmouseover=\"if(this.style.marginRight!='1px'){this.style.background='"+this.styleSelectionHoverBg+"';this.style.color='"+this.styleSelectionHoverFg+"'}\" onmouseout=\"if(this.style.marginRight!='1px'){this.style.background='';this.style.color=''}\">";
        sHTML+="<td unselectable=on onclick=\"doApplyStyle('"+this.oName+"','"+tmpSelector.split(".")[1]+"')\" style='padding:2px;'>";
        if(sSelector.split(".")[0]=="")
          sHTML+="<span unselectable=on style=\""+sCssText+";margin:0;\">"+sCaption+"</span>";
        else
          sHTML+="<span unselectable=on style=\""+sCssText+";margin:0;\">"+sSelector+"</span>";
        sHTML+="</td></tr>";
        }
      }
    }
  sHTML+="<tr><td height=50%>&nbsp;</td></tr></table></div>";//50% spy di style selector tdk keloar scroll (kalau ada doctype)

  if(bShowStyles)document.getElementById("idStyles"+this.oName).innerHTML=sHTML;
  else{alert("No stylesheet found.")}
  };
  
/**** REALTIME ***/
/*function editorDoc_onkeydown(oName)
  {
  realTime(oName);
  }*/
function editorDoc_onkeyup(oName)
  {
  if(eval(oName).isAfterPaste)
    {
    eval(oName).cleanDeprecated();

    //*** RUNTIME STYLES ***
    eval(oName).runtimeBorder(false);
    eval(oName).runtimeStyles();
    //***********************
    eval(oName).isAfterPaste=false;
    }
  
  var oEdt=eval(oName);
  if(oEdt.tmKeyup) {clearTimeout(oEdt.tmKeyup); oEdt.tmKeyup=null;} 
  if(!oEdt.tmKeyup)oEdt.tmKeyup=setTimeout(function(){realTime(oName);}, 1000);
  
  oEdt.bookmarkSelection();
  
  };
function editorDoc_onmouseup(oName)
  {
  oUtil.activeElement=null;//focus ke editor, jgn pakai selection dari tag selector
  oUtil.oName=oName;oUtil.oEditor=eval("idContent"+oName);oUtil.obj=eval(oName);eval(oName).hide();//pengganti onfocus
  realTime(oName);
  
  //if selected, show the context toolbar
  /*
  var oEditor=eval("idContent"+oName);
  var oSel=oEditor.document.selection.createRange();  
  var tb=isTbars["ctx"+oName];
  if (oSel.parentElement && oSel.text!="") {
    if(oSel.text!="") {
      tb.rt.document=oEditor.document;
      var tmp=oEditor.frameElement,x=0,y=0;
      while(tmp) {x+=tmp.offsetLeft; y+=tmp.offsetTop;tmp=tmp.offsetParent;}
      tb.rt.docOff=[x, y];
      tb.show(oEditor.event.clientX+x+10,oEditor.event.clientY+y+10);
    }
  } else {
    if(tb.rt.active) tb.hide();
  }
  */
  
  oUtil.obj.bookmarkSelection();
  
  };
function setActiveEditor(oName)
  {
  //eval(oName).focus();//focus first
  oUtil.oName=oName;
  oUtil.oEditor=eval("idContent"+oName);
  oUtil.obj=eval(oName);
  };
var arrTmp=[];
function GetElement(oElement,sMatchTag)//Used in realTime() only.
  {
  while (oElement!=null&&oElement.tagName!=sMatchTag)
    {
    if(oElement.tagName=="BODY")return null;
    oElement=oElement.parentElement;
    }
  return oElement;
  };
var arrTmp2=[];//TAG SELECTOR
function realTime(oName,bTagSel)
  {
  //Focus stuff
  if(!eval(oName).checkFocus())return;

  var oEditor=eval("idContent"+oName);
  var oSel=oEditor.document.selection.createRange();
  var obj=eval(oName);

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
   
    var oTable=(oSel.parentElement!=null?GetElement(oSel.parentElement(),"TABLE"):GetElement(oSel.item(0),"TABLE"));
    if (oTable)
      {
      ddTbl.enableItem("mnuCellEdit"+oName, false);
      btn.setState(1);
      }
    else btn.setState(5);

    var oTD=(oSel.parentElement!=null?GetElement(oSel.parentElement(),"TD"):GetElement(oSel.item(0),"TD"));
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
  
  if(obj.btnCut)
    {
    btn=tbar.btns["btnCut"+oName];
    btn.setState(doc.queryCommandEnabled("Cut")?1:5);
    }
  if(obj.btnCopy)
    {
    btn=tbar.btns["btnCopy"+oName];
    btn.setState(doc.queryCommandEnabled("Copy")?1:5);
    }
  if(obj.btnPaste)
    {
    btn=tbar.btns["btnPaste"+oName];
    btn.setState(doc.queryCommandEnabled("Paste")?1:5);
    }
  //if(obj.btnPasteWord)
  //  {
  //  btn=tbar.btns["btnPasteWord"+oName];
  //  btn.setState(doc.queryCommandEnabled("Paste")?1:5);
  //  }
  //if(obj.btnPasteText)
  //  {
  //  btn=tbar.btns["btnPasteText"+oName];
  //  btn.setState(doc.queryCommandEnabled("Paste")?1:5);
  //  }

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
    btn.setState(doc.queryCommandEnabled("BlockDirLTR")?(doc.queryCommandState("BlockDirLTR")?4:1):5);
    }
  if(obj.btnRTL)
    {
    btn=tbar.btns["btnRTL"+oName];
    btn.setState(doc.queryCommandEnabled("BlockDirRTL")?(doc.queryCommandState("BlockDirRTL")?4:1):5);
    }
  
  var v=(oSel.parentElement?1:5);
  if(obj.btnForeColor)tbar.btns["btnForeColor"+oName].setState(v);
  if(obj.btnBackColor)tbar.btns["btnBackColor"+oName].setState(v);
  if(obj.btnLine)tbar.btns["btnLine"+oName].setState(v);
  
  try{oUtil.onSelectionChanged()}catch(e){;}

  //try{obj.onSelectionChanged()}catch(e){;}

  //STYLE SELECTOR ~~~~~~~~~~~~~~~~~~
  var idStyles=document.getElementById("idStyles"+oName);
  if(idStyles.innerHTML!="")
    {
    var oElement;
    if(oUtil.activeElement)
      oElement=oUtil.activeElement;
    else
      {
      if (oSel.parentElement)oElement=oSel.parentElement();
      else oElement=oSel.item(0);
      }
    var sCurrClass=oElement.className;
    
    var oRows=document.getElementById("tblStyles"+oName).rows;
    for(var i=0;i<oRows.length-1;i++)
      {
      sClass=oRows[i].childNodes[0].innerText;
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
  if(obj.useTagSelector && !bTagSel)
    {
    if (oSel.parentElement) oElement=oSel.parentElement();
    else oElement=oSel.item(0);
    var sHTML="";var i=0;
    arrTmp2=[];//clear
    while (oElement!=null && oElement.tagName!="BODY")
      {
      arrTmp2[i]=oElement;
      var sTagName = oElement.tagName;
      sHTML = "&nbsp; &lt;<span id=tag"+oName+i+" unselectable=on style='text-decoration:underline;cursor:hand' onclick=\""+oName+".selectElement("+i+")\">" + sTagName + "</span>&gt;" + sHTML;
      oElement = oElement.parentElement;
      i++;
      }
    sHTML = "&nbsp;&lt;BODY&gt;" + sHTML;
    eval("idElNavigate"+oName).innerHTML = sHTML;
    eval("idElCommand"+oName).style.display="none";
    }

  if(obj.isAfterPaste)
    {
    obj.cleanDeprecated();

    //*** RUNTIME STYLES ***
    obj.runtimeBorder(false);
    obj.runtimeStyles();
    //***********************
    obj.isAfterPaste=false;
    }
  };
function realtimeFontSelect(oName)
  {
  var oEditor=eval("idContent"+oName);
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
  var oEditor=eval("idContent"+oName);
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
  var sTagSelTop="<table unselectable=on ondblclick='"+this.oName+".moveTagSelector()' width='100%' cellpadding=0 cellspacing=0 style='border:#cfcfcf 1px solid;border-bottom:none'><tr style='background:#f8f8f8;font-family:arial;font-size:10px;color:black;'>"+
    "<td id=idElNavigate"+ this.oName +" style='padding:1px;width:100%;' valign=top>&nbsp;</td>"+
    "<td align=right valign='center' nowrap>"+
    "<span id=idElCommand"+ this.oName +" unselectable=on style='vertical-align:middle;display:none;text-decoration:underline;cursor:hand;padding-right:5;' onclick='"+this.oName+".removeTag()'>"+getTxt("Remove Tag")+"</span>"+
    "</td></tr></table>";

  var sTagSelBottom="<table unselectable=on ondblclick='"+this.oName+".moveTagSelector()' width='100%' cellpadding=0 cellspacing=0 style='border-left:#cfcfcf 1px solid;border-right:#cfcfcf 1px solid;'><tr style='background-color:#f8f8f8;font-family:arial;font-size:10px;color:black;'>"+
    "<td id=idElNavigate"+ this.oName +" style='padding:1px;width:100%;' valign=top>&nbsp;</td>"+
    "<td align=right valign='center' nowrap>"+
    "<span id=idElCommand"+ this.oName +" unselectable=on style='vertical-align:middle;display:none;text-decoration:underline;cursor:hand;padding-right:5;' onclick='"+this.oName+".removeTag()'>"+getTxt("Remove Tag")+"</span>"+
    "</td></tr></table>";

  if(this.TagSelectorPosition=="top")
    {
    eval("idTagSelTop"+this.oName).innerHTML="";
    eval("idTagSelBottom"+this.oName).innerHTML=sTagSelBottom;
    eval("idTagSelTopRow"+this.oName).style.display="none";
    eval("idTagSelBottomRow"+this.oName).style.display="block";
    this.TagSelectorPosition="bottom";
    }
  else//if(this.TagSelectorPosition=="bottom")
    {
    eval("idTagSelTop"+this.oName).innerHTML=sTagSelTop;
    eval("idTagSelBottom"+this.oName).innerHTML="";
    eval("idTagSelTopRow"+this.oName).style.display="block";
    eval("idTagSelBottomRow"+this.oName).style.display="none";
    this.TagSelectorPosition="top";
    }
  };
function selectElement(i)
  {
  var oEditor=eval("idContent"+this.oName);
  var oSelRange = oEditor.document.body.createControlRange();
  var oActiveElement;
  try
    {
    oSelRange.add(arrTmp2[i]);
    oSelRange.select();
    realTime(this.oName,true);
    oActiveElement = arrTmp2[i];
    if(oActiveElement.tagName!="TD"&&
      oActiveElement.tagName!="TR"&&
      oActiveElement.tagName!="TBODY"&&
      oActiveElement.tagName!="LI")
      eval("idElCommand"+this.oName).style.display=""; 
    }
  catch(e)
    {
    try//utk multiple instance, kalau select tag tapi tdk focus atau select list & content lain di luar list lalu set color
      {
      var oSelRange = oEditor.document.body.createTextRange();
      oSelRange.moveToElementText(arrTmp2[i]);
      oSelRange.select();
      realTime(this.oName,true);
      oActiveElement = arrTmp2[i];
      if(oActiveElement.tagName!="TD"&&
        oActiveElement.tagName!="TR"&&
        oActiveElement.tagName!="TBODY"&&
        oActiveElement.tagName!="LI")
        eval("idElCommand"+this.oName).style.display="";
      }
    catch(e){return;}
    }
  for(var j=0;j<arrTmp2.length;j++)eval("tag"+this.oName+j).style.background="";
  eval("tag"+this.oName+i).style.background="DarkGray";

  if(oActiveElement)
    oUtil.activeElement=oActiveElement;//Set active element in the Editor
  };
function removeTag()
  {
  if(!this.checkFocus())return;//Focus stuff
  eval(this.oName).saveForUndo();//Save for Undo
  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  var sType=oEditor.document.selection.type;
  if(sType=="Control")
    {
    oSel.item(0).outerHTML="";
    this.focus();
    realTime(this.oName);
    return;
    }

  var oActiveElement=oUtil.activeElement;
  var oSelRange = oEditor.document.body.createTextRange();
  oSelRange.moveToElementText(oActiveElement);
  oSel.setEndPoint("StartToStart",oSelRange);
  oSel.setEndPoint("EndToEnd",oSelRange);
  oSel.select();
  
  this.saveForUndo();

  sHTML=oActiveElement.innerHTML;
  sHTML=fixPathEncode(sHTML);
  
  var oTmp=oActiveElement.parentElement;
  if(oTmp.innerHTML==oActiveElement.outerHTML)//<b><u>TEXT</u><b> (<u> is selected)
    {//oTmp=<b> , oActiveElement=<u>
    oTmp.innerHTML=sHTML;

    fixPathDecode(oEditor);

    var oSelRange = oEditor.document.body.createTextRange();
    oSelRange.moveToElementText(oTmp);
    oSel.setEndPoint("StartToStart",oSelRange);
    oSel.setEndPoint("EndToEnd",oSelRange);
    oSel.select();
    realTime(this.oName);
    this.selectElement(0);
    return;
    }
  else
    {
    oActiveElement.outerHTML="";
    oSel.pasteHTML(sHTML);

    fixPathDecode(oEditor);
    
    this.focus();
    realTime(this.oName);
    }

  //*** RUNTIME STYLES ***
  this.runtimeBorder(false);
  this.runtimeStyles();
  //***********************
  };

/*** RUNTIME BORDERS ***/
function runtimeBorderOn()
  {
  this.runtimeBorderOff();//reset

  var oEditor=eval("idContent"+this.oName);
  var oTables=oEditor.document.getElementsByTagName("TABLE");
  for(i=0;i<oTables.length;i++)
    {
    var oTable=oTables[i];
    if(oTable.border==0)
      {
      var oCells=oTable.getElementsByTagName("TD");
      for(j=0;j<oCells.length;j++)
        {
        if(oCells[j].style.borderLeftWidth=="0px"||
          oCells[j].style.borderLeftWidth==""||
          oCells[j].style.borderLeftWidth=="medium")
            {
            oCells[j].runtimeStyle.borderLeftWidth=1;
            oCells[j].runtimeStyle.borderLeftColor="#BCBCBC";
            oCells[j].runtimeStyle.borderLeftStyle="dotted";
            }
        if(oCells[j].style.borderRightWidth=="0px"||
          oCells[j].style.borderRightWidth==""||
          oCells[j].style.borderRightWidth=="medium")
            {
            oCells[j].runtimeStyle.borderRightWidth=1;
            oCells[j].runtimeStyle.borderRightColor="#BCBCBC";
            oCells[j].runtimeStyle.borderRightStyle="dotted";
            }
        if(oCells[j].style.borderTopWidth=="0px"||
          oCells[j].style.borderTopWidth==""||
          oCells[j].style.borderTopWidth=="medium")
            {
            oCells[j].runtimeStyle.borderTopWidth=1;
            oCells[j].runtimeStyle.borderTopColor="#BCBCBC";
            oCells[j].runtimeStyle.borderTopStyle="dotted";
            }
        if(oCells[j].style.borderBottomWidth=="0px"||
          oCells[j].style.borderBottomWidth==""||
          oCells[j].style.borderBottomWidth=="medium")
            {
            oCells[j].runtimeStyle.borderBottomWidth=1;
            oCells[j].runtimeStyle.borderBottomColor="#BCBCBC";
            oCells[j].runtimeStyle.borderBottomStyle="dotted";
            }
        }
      }
    }
  };
function runtimeBorderOff()
  {
  var oEditor=eval("idContent"+this.oName);
  var oTables=oEditor.document.getElementsByTagName("TABLE");
  for(i=0;i<oTables.length;i++)
    {
    var oTable=oTables[i];
    if(oTable.border==0)
      {
      var oCells=oTable.getElementsByTagName("TD");
      for(j=0;j<oCells.length;j++)
        {
        oCells[j].runtimeStyle.borderWidth="";
        oCells[j].runtimeStyle.borderColor="";
        oCells[j].runtimeStyle.borderStyle="";
        }
      }
    }
  };
function runtimeBorder(bToggle)
  {
  if(bToggle)
    {
    if(this.IsRuntimeBorderOn)
      {
      this.runtimeBorderOff();
      this.IsRuntimeBorderOn=false;
      }
    else
      {
      this.runtimeBorderOn();
      this.IsRuntimeBorderOn=true;
      }
    }
  else
    {//refresh based on the current status
    if(this.IsRuntimeBorderOn) this.runtimeBorderOn();
    else this.runtimeBorderOff();
    }
  };

/*** RUNTIME STYLES ***/
function runtimeStyles()
  {
  var oEditor=eval("idContent"+this.oName);
  var oForms=oEditor.document.getElementsByTagName("FORM");
  for (i=0;i<oForms.length;i++) oForms[i].runtimeStyle.border="#7bd158 1px dotted";

  var oBookmarks=oEditor.document.getElementsByTagName("A");
  for (i=0;i<oBookmarks.length;i++)
    {
    var oBookmark=oBookmarks[i];
    if(oBookmark.name||oBookmark.NAME)
      {
      if(oBookmark.innerHTML=="")oBookmark.runtimeStyle.width="1px";
      oBookmark.runtimeStyle.padding="0px";
      oBookmark.runtimeStyle.paddingLeft="1px";
      oBookmark.runtimeStyle.paddingRight="1px";
      oBookmark.runtimeStyle.border="#888888 1px dotted";
      oBookmark.runtimeStyle.borderLeft="#cccccc 10px solid";
      }
    }
  };

/**************************
  NEW SPAN OPERATION 
**************************/

/*** CLEAN ***/
function cleanFonts()
  {
  var oEditor=eval("idContent"+this.oName);
  var allFonts=oEditor.document.body.getElementsByTagName("FONT");
  if(allFonts.length==0)return false;
  var f;
  while(allFonts.length>0)
    {
    f=allFonts[0];
    if(f.hasChildNodes && f.childNodes.length==1 && f.childNodes[0].nodeType==1 && f.childNodes[0].nodeName=="SPAN") 
      {
      //if font containts only span child node
      copyAttribute(f.childNodes[0],f);
      f.removeNode(false);
      }
    else
      if(f.parentElement.nodeName=="SPAN" && f.parentElement.childNodes.length==1)
        {
        //font is the only child node of span.
        copyAttribute(f.parentElement,f);
        f.removeNode(false);
        }
      else
        {
        var newSpan=oEditor.document.createElement("SPAN");
        copyAttribute(newSpan,f);
        var sHTML=f.innerHTML;
        sHTML=fixPathEncode(sHTML);
        newSpan.innerHTML=sHTML;
        f.replaceNode(newSpan);
        fixPathDecode(oEditor);                
        }
    }
  return true;
  };
function cleanTags(elements,sVal)//WARNING: Dgn asumsi underline & linethrough tidak bertumpuk
  {
  var oEditor=eval("idContent"+this.oName);
  var f;
  while(elements.length>0)
    {
    f=elements[0];
    if(f.hasChildNodes && f.childNodes.length==1 && f.childNodes[0].nodeType==1 && f.childNodes[0].nodeName=="SPAN") 
      {//if font containts only span child node
      if(sVal=="bold")f.childNodes[0].style.fontWeight="bold";
      if(sVal=="italic")f.childNodes[0].style.fontStyle="italic";
      if(sVal=="line-through")f.childNodes[0].style.textDecoration="line-through";
      if(sVal=="underline")f.childNodes[0].style.textDecoration="underline";  
      f.removeNode(false);
      }
    else
      if(f.parentElement.nodeName=="SPAN" && f.parentElement.childNodes.length==1)
        {//font is the only child node of span.
        if(sVal=="bold")f.parentElement.style.fontWeight="bold";
        if(sVal=="italic")f.parentElement.style.fontStyle="italic";
        if(sVal=="line-through")f.parentElement.style.textDecoration="line-through";
        if(sVal=="underline")f.parentElement.style.textDecoration="underline";  
        f.removeNode(false);
        }
      else
        {
        var newSpan=oEditor.document.createElement("SPAN");
        if(sVal=="bold")newSpan.style.fontWeight="bold";
        if(sVal=="italic")newSpan.style.fontStyle="italic";
        if(sVal=="line-through")newSpan.style.textDecoration="line-through";
        if(sVal=="underline")newSpan.style.textDecoration="underline";
        
        var sHTML=f.innerHTML;
        sHTML=fixPathEncode(sHTML);        
        newSpan.innerHTML=sHTML;
        f.replaceNode(newSpan);
        fixPathDecode(oEditor);
        }
    }
  };
function replaceTags(sFrom,sTo)
  {
  var oEditor=eval("idContent"+this.oName);
  var elements=oEditor.document.getElementsByTagName(sFrom);

  var newSpan;
  var count=elements.length;
  while(count > 0) 
    {
    f=elements[0];
    newSpan=oEditor.document.createElement(sTo);
    
    var sHTML=f.innerHTML;
    sHTML=fixPathEncode(sHTML);
    newSpan.innerHTML=sHTML;
    f.replaceNode(newSpan);          
    fixPathDecode(oEditor);
    count--;
    }
  };
/************************************
  Used in loadHTML, putHTML, 
  editorDoc_onkeyup, realTime, 
  getHTML, getXHTML, 
  getHTMLBody, getXHTMLBody 
  pasteWord.htm
*************************************/
function cleanDeprecated()
  {
  var oEditor=eval("idContent"+this.oName);

  var elements;

  //elements=oEditor.document.body.getElementsByTagName("STRONG");
  //this.cleanTags(elements,"bold");
  //elements=oEditor.document.body.getElementsByTagName("B");
  //this.cleanTags(elements,"bold");

  //elements=oEditor.document.body.getElementsByTagName("I");
  //this.cleanTags(elements,"italic");
  //elements=oEditor.document.body.getElementsByTagName("EM");
  //this.cleanTags(elements,"italic");
  
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
  var count=elements.length;
  while(count>0) 
    {
    f=elements[0];
    f.removeNode(false);   
    count--;
    }
  
  this.cleanFonts();
  this.cleanEmptySpan();

  return true;
  };

/*** APPLY ***/
function applyBold()
  {
  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  this.saveForUndo();
  
  //Back to normal
  this.doCmd("bold");
  return;
  
  var currState=oEditor.document.queryCommandState("Bold");

  if(oUtil.activeElement) oElement=oUtil.activeElement;
  else 
    {
    if(oSel.parentElement)
      {
      if(oSel.text=="")
        {
        oElement=oSel.parentElement();
        if(oElement.tagName=="BODY")return;
        }
      else
        {
        if(currState)
          {
          this.applySpanStyle([["fontWeight",""]]);
          this.cleanEmptySpan();
          }
        else this.applySpanStyle([["fontWeight","bold"]]);
        
        if(currState==oEditor.document.queryCommandState("Bold")&&currState==true)
          this.applySpanStyle([["fontWeight","normal"]]);
        return;
        }
      }
    else oElement=oSel.item(0);
    }

  if(currState)oElement.style.fontWeight="";
  else oElement.style.fontWeight="bold";

  if(currState==oEditor.document.queryCommandState("Bold")&&currState==true)
    oElement.style.fontWeight="normal";
  };
function applyItalic()
  {
  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  this.saveForUndo();
  
  //Back to normal
  this.doCmd("italic");
  return;
  
  var currState=oEditor.document.queryCommandState("Italic");

  if(oUtil.activeElement) oElement=oUtil.activeElement;
  else 
    {
    if(oSel.parentElement)
      {
      if(oSel.text=="")
        {
        oElement=oSel.parentElement();
        if(oElement.tagName=="BODY")return;
        }
      else
        {
        if(currState)
          {
          this.applySpanStyle([["fontStyle",""]]);
          this.cleanEmptySpan();
          }
        else this.applySpanStyle([["fontStyle","italic"]]);
        
        if(currState==oEditor.document.queryCommandState("Italic")&&currState==true)
          this.applySpanStyle([["fontStyle","normal"]]);
        return;
        }
      }
    else oElement=oSel.item(0);
    }

  if(currState)oElement.style.fontStyle="";
  else oElement.style.fontStyle="italic";

  if(currState==oEditor.document.queryCommandState("Italic")&&currState==true)
    oElement.style.fontStyle="normal";
  };

function GetUnderlinedTag(oElement)//Used in realTime() only.
  {
  while (oElement!=null&&oElement.style.textDecoration.indexOf("underline")==-1)
    {
    if(oElement.tagName=="BODY")return null;
    oElement=oElement.parentElement;
    }
  return oElement;
  };
function GetOverlinedTag(oElement)//Used in realTime() only.
  {
  while (oElement!=null&&oElement.style.textDecoration.indexOf("line-through")==-1)
    {
    if(oElement.tagName=="BODY")return null;
    oElement=oElement.parentElement;
    }
  return oElement;
  };
function applyLine(sCmd)
  {
  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  this.saveForUndo();   
  
  if(!oSel.parentElement)return;
  var bIsUnderlined=oEditor.document.queryCommandState("Underline");
  var bIsOverlined=oEditor.document.queryCommandState("Strikethrough");
  if(bIsUnderlined && !bIsOverlined)
    {
    if(sCmd=="underline")
      {
      oElement=GetUnderlinedTag(oSel.parentElement());
      if(oElement)
        oElement.style.textDecoration=oElement.style.textDecoration.replace("underline","");
      }
    else//"line-through"      
      {//biasa => apply "line-through"
      if(oSel.text=="")
        {
        oElement=oSel.parentElement();
        oElement.style.textDecoration=oElement.style.textDecoration+" line-through";
        }
      else 
        {
        this.applySpanStyle([["textDecoration","line-through"]]);//limitation:
        //kalau yg di-select persis di tag yg underlined, maka
        //underline akan hilang, diganti overline.
        }
      }
    }
  else if(bIsOverlined && !bIsUnderlined)
    {   
    if(sCmd=="line-through")
      {
      oElement=GetOverlinedTag(oSel.parentElement());
      if(oElement)
        oElement.style.textDecoration=oElement.style.textDecoration.replace("line-through","");
      }
    else//"underline"     
      {//biasa => apply "underline" 
      if(oSel.text=="")
        {
        oElement=oSel.parentElement();
        oElement.style.textDecoration=oElement.style.textDecoration+" underline";
        }
      else 
        {
        this.applySpanStyle([["textDecoration","underline"]]);//limitation:
        //kalau yg di-select persis di tag yg overlined, maka
        //overline akan hilang, diganti underline.
        }
      } 
    }
  else if(bIsUnderlined && bIsOverlined)
    {
    if(sCmd=="underline")
      {
      oElement=GetUnderlinedTag(oSel.parentElement());
      if(oElement)
        oElement.style.textDecoration=oElement.style.textDecoration.replace("underline","");
      }
    else
      {
      oElement=GetOverlinedTag(oSel.parentElement());
      if(oElement)
        oElement.style.textDecoration=oElement.style.textDecoration.replace("line-through","");
      }   
    }
  else
    {//clean text
    if(sCmd=="underline")     
      {
      if(oSel.text=="")
        {
        oElement=oSel.parentElement();
        if(oElement.tagName=="BODY")return;
        oElement.style.textDecoration="underline";
        }
      else this.applySpanStyle([["textDecoration","underline"]]);
      } 
    else//"line-through"      
      {
      if(oSel.text=="")
        {
        oElement=oSel.parentElement();
        if(oElement.tagName=="BODY")return;
        oElement.style.textDecoration="line-through";
        }
      else this.applySpanStyle([["textDecoration","line-through"]]);
      } 
    }
  return;
  
  
  var currState1=oEditor.document.queryCommandState("Underline");
  var currState2=oEditor.document.queryCommandState("Strikethrough");
  var sValue;
  if(sCmd=="underline")
    {
    if(currState1&&currState2)sValue="line-through";
    else if(!currState1&&currState2)sValue="underline line-through";    
    else if(currState1&&!currState2)sValue="";
    else if(!currState1&&!currState2)sValue="underline";
    }
  else//"line-through"
    {
    if(currState1&&currState2)sValue="underline";
    else if(!currState1&&currState2)sValue="";
    else if(currState1&&!currState2)sValue="underline line-through";    
    else if(!currState1&&!currState2)sValue="line-through";
    }

  if(oUtil.activeElement) oElement=oUtil.activeElement;
  else 
    {
    if(oSel.parentElement)
      {
      if(oSel.text=="")
        {
        oElement=oSel.parentElement();
        if(oElement.tagName=="BODY")return;
        }
      else
        {
        if(sValue=="")
          {
          this.applySpanStyle([["textDecoration",""]]);
          this.cleanEmptySpan();
          }
        else this.applySpanStyle([["textDecoration",sValue]]);

        /* Note: text-decoration is not inherited. */
        if((sCmd=="underline"&&currState1==oEditor.document.queryCommandState("Underline")&&currState1==true) ||
          (sCmd=="line-through"&&currState2==oEditor.document.queryCommandState("Strikethrough")&&currState2==true))
          {
          this.applySpanStyle([["textDecoration",""]]);
          this.cleanEmptySpan();
          }
        return;
        }
      }
    else oElement=oSel.item(0);
    }
    
  oElement.style.textDecoration=sValue;

  /* Note: text-decoration is not inherited. */
  if((sCmd=="underline"&&currState1==oEditor.document.queryCommandState("Underline")&&currState1==true) ||
    (sCmd=="line-through"&&currState2==oEditor.document.queryCommandState("Strikethrough")&&currState2==true))
    {
    this.applySpanStyle([["textDecoration",""]]);
    this.cleanEmptySpan();
    }
  };
function applyColor(sType,sColor)
  {
  if(!this.checkFocus())return;//Focus stuff
  
  this.hide();
  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  this.saveForUndo();

  if(oUtil.activeElement)
    {
    oElement=oUtil.activeElement;
    if(sType=="ForeColor")oElement.style.color=sColor;
    else oElement.style.backgroundColor=sColor;
    }
  else if(oSel.parentElement)
    {
    if(oSel.text=="")
      {
      oElement=oSel.parentElement();
      if(oElement.tagName=="BODY")return;
      if(sType=="ForeColor")oElement.style.color=sColor;
      else oElement.style.backgroundColor=sColor;
      }
    else
      {
      if(sType=="ForeColor")this.applySpanStyle([["color",sColor]]);
      else this.applySpanStyle([["backgroundColor",sColor]]);
      }
    }

  if(sColor=="")
    {
    this.cleanEmptySpan();
    realTime(this.oName);
    }
  };
function applyFontName(val)
  {
  this.hide();

  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  this.hide();//ini menyebabkan text yg ter-select menjadi tdk ter-select di framed-page.
  //Solusi: oSel di select lagi
  oSel.select();
  this.saveForUndo();

  //for existing SPANs
  if(oSel.parentElement)
    {
    var tempRange=oEditor.document.body.createTextRange();
    //var allSpans=oSel.parentElement().getElementsByTagName("SPAN");//tdk sempurna utk selection across tables
    var allSpans=oEditor.document.getElementsByTagName("SPAN");//ok
    for(var i=0;i<allSpans.length;i++)
      {
      tempRange.moveToElementText(allSpans[i]);
      if(oSel.inRange(tempRange))allSpans[i].style.fontFamily=val;
      }
    }

  this.doCmd("fontname",val);
  replaceWithSpan(oEditor);
  realTime(this.oName);
  };
function applyFontSize(val)
  {
  this.hide();

  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  this.hide();
  oSel.select();
  this.saveForUndo();

  //for existing SPANs
  if(oSel.parentElement)
    {
    var tempRange=oEditor.document.body.createTextRange();
    //var allSpans=oSel.parentElement().getElementsByTagName("SPAN");
    var allSpans=oEditor.document.getElementsByTagName("SPAN");//ok
    for(var i=0;i<allSpans.length;i++)
      {
      tempRange.moveToElementText(allSpans[i]);
      if (oSel.inRange(tempRange))
        {//tdk perlu ada +/- (krn optionnya tdk ada)
        if(val==1)allSpans[i].style.fontSize="8pt";
        else if(val==2)allSpans[i].style.fontSize="10pt";
        else if(val==3)allSpans[i].style.fontSize="12pt";
        else if(val==4)allSpans[i].style.fontSize="14pt";
        else if(val==5)allSpans[i].style.fontSize="18pt";
        else if(val==6)allSpans[i].style.fontSize="24pt";
        else if(val=7)allSpans[i].style.fontSize="36pt";
        }
      }
    }

  this.doCmd("fontsize",val);
  replaceWithSpan(oEditor);
  realTime(this.oName);
  };
function applySpanStyle(arrStyles,sClassName)
  {
  //tdk perlu focus stuff
  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  this.hide();
  oSel.select();
  this.saveForUndo();

  //Step 1: apply to existing SPANs
  if(oSel.parentElement)
    {
    var tempRange=oEditor.document.body.createTextRange();
    var oEl=oSel.parentElement();
    //var allSpans=oSel.parentElement().getElementsByTagName("SPAN");//tdk sempurna utk selection across tables
    var allSpans=oEditor.document.getElementsByTagName("SPAN");//ok - WARNING: hrs cek semua span.
    
    for (var i=0;i<allSpans.length;i++)
      {
      tempRange.moveToElementText(allSpans[i]);
      if (oSel.inRange(tempRange))
        copyStyleClass(allSpans[i],arrStyles,sClassName);
      }
    }

  //Step 2: apply to selection
  this.doCmd("fontname","");// 2.a
  replaceWithSpan(oEditor,arrStyles,sClassName);// 2.b
  
  this.cleanEmptySpan();// 2.c => krn ada kemungkinan arrStyle & sClassName semua di set = "", ini akan meninggalkan empty span. WARNING: pengaruh ke selection? => sudah di-test no problem.
  realTime(this.oName);// 2.d
  };
function doClean()
  {
  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  this.saveForUndo();

  this.doCmd('RemoveFormat');

  if(oUtil.activeElement)
    {
    var oActiveElement=oUtil.activeElement;
    oActiveElement.removeAttribute("className",0);
    oActiveElement.removeAttribute("style",0);

    if(oActiveElement.tagName=="H1"||oActiveElement.tagName=="H2"||
      oActiveElement.tagName=="H3"||oActiveElement.tagName=="H4"||
      oActiveElement.tagName=="H5"||oActiveElement.tagName=="H6"||
      oActiveElement.tagName=="PRE"||oActiveElement.tagName=="P"||
      oActiveElement.tagName=="DIV")
      {
      if(this.useDIV)this.doCmd('FormatBlock','<DIV>');
      else this.doCmd('FormatBlock','<P>');
      }
    }
  else
    {   
    var oSel=oEditor.document.selection.createRange();
    var sType=oEditor.document.selection.type;
    if (oSel.parentElement)
      {
      if(oSel.text=="")
        {
        oEl=oSel.parentElement();
        if(oEl.tagName=="BODY")return;
        else
          {
          oEl.removeAttribute("className",0);
          oEl.removeAttribute("style",0);
          if(oEl.tagName=="H1"||oEl.tagName=="H2"||
            oEl.tagName=="H3"||oEl.tagName=="H4"||
            oEl.tagName=="H5"||oEl.tagName=="H6"||
            oEl.tagName=="PRE"||oEl.tagName=="P"||oEl.tagName=="DIV")
            {
            if(this.useDIV)this.doCmd('FormatBlock','<DIV>');
            else this.doCmd('FormatBlock','<P>');
            }
          }
        }
      else
        {
        this.applySpanStyle([
                  ["backgroundColor",""],
                  ["color",""],
                  ["fontFamily",""],
                  ["fontSize",""],
                  ["fontWeight",""],
                  ["fontStyle",""],
                  ["textDecoration",""],
                  ["letterSpacing",""],
                  ["verticalAlign",""],
                  ["textTransform",""],
                  ["fontVariant",""]
                  ],"");
        return;
        }
      }
    else
      {
      oEl=oSel.item(0);
      oEl.removeAttribute("className",0);
      oEl.removeAttribute("style",0);
      }
    }
  this.cleanEmptySpan();
  realTime(this.oName);
  };
function cleanEmptySpan()//WARNING: blm bisa remove span yg bertumpuk dgn style sama,dst.
  {
  var bReturn=false;
  var oEditor=eval("idContent"+this.oName);
  var allSpans=oEditor.document.getElementsByTagName("SPAN");
  if(allSpans.length==0)return false;

  var emptySpans=[];
  var reg = /<\s*SPAN\s*>/gi;
  for(var i=0;i<allSpans.length;i++)
    {
    if(allSpans[i].outerHTML.search(reg)==0)
      emptySpans[emptySpans.length]=allSpans[i];
    }
  var theSpan,theParent;
  for(var i=0;i<emptySpans.length;i++)
    {
    theSpan=emptySpans[i];
    theSpan.removeNode(false);
    bReturn=true;
    }
  return bReturn;
  };

/*** COMMON ***/
function copyStyleClass(newSpan,arrStyles,sClassName)
  {
  if(arrStyles)
    for(var i=0;i<arrStyles.length;i++)
      {
      newSpan.style[arrStyles[i][0]] = arrStyles[i][1];
      //eval("newSpan.style."+arrStyles[i][0]+"=\""+arrStyles[i][1]+"\"");
      }

  //style attr. yg empty, attr.style akan ter-remove otomatis
  if(newSpan.style.fontFamily=="")
    {//Text Formatting Related
    newSpan.style.cssText=newSpan.style.cssText.replace("FONT-FAMILY: ; ","");
    newSpan.style.cssText=newSpan.style.cssText.replace("FONT-FAMILY: ","");
    }

  if(sClassName!=null)
    {
    newSpan.className=sClassName;
    if(newSpan.className=="")newSpan.removeAttribute("className",0);//WARNING: this will remove span (for empty attributes).
    //WARNING: otomatis me-remove empty span!!
    }
  //remove class attribut tdk perlu, krn tdk ada facility yg assign class="" (yg ada hanya remove class).
  };
function copyAttribute(newSpan,f)
  {
  if((f.face!=null)&&(f.face!=""))newSpan.style.fontFamily=f.face;
  if((f.size!=null)&&(f.size!=""))
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
  if((f.style.backgroundColor!=null)&&(f.style.backgroundColor!=""))newSpan.style.backgroundColor=f.style.backgroundColor;
  if((f.color!=null)&&(f.color!=""))newSpan.style.color=f.color;
  if((f.className!=null)&&(f.className!=""))newSpan.className=f.className;
  };
function replaceWithSpan(oEditor,arrStyles,sClassName)
  {
  var oSel=oEditor.document.selection.createRange();

  /*** Save length of selected text ***/
  var oSpanStart;
  oSel.select();
  var nSelLength=oSel.text.length;
  /************************************/

  //change all font to span
  var allFonts=new Array();
  if (oSel.parentElement().nodeName=="FONT" && oSel.parentElement().innerText==oSel.text) //Y
    {
    oSel.moveToElementText(oSel.parentElement());
    allFonts[0]=oSel.parentElement();
    } 
  else 
    {//selection over paragraphs
    //allFonts=oSel.parentElement().getElementsByTagName("FONT");
    allFonts=oEditor.document.getElementsByTagName("FONT");//WARNING: asumsi tdk ada FONT tag sblmnya.
    }

  var tempRange=oEditor.document.body.createTextRange();
  var newSpan, f;
  var count=allFonts.length;
  while(count>0)
    {
    f=allFonts[0];
    if(f==null||f.parentElement==null){count--;continue}
    tempRange.moveToElementText(f);

    /*************************************************
    Bagian ini utk mengantisipasi kalau setelah apply font, kita apply Bold (1 x) atau Bold & Italic (berarti 2 x)
    atau Bold, Italic & Underline (berarti 3x). Supaya dalam kasus, kalau apply font lagi tdk membuat span baru:
      <span><b><i><span baru>
    tapi tetap:
      <span><b><i>
    *************************************************/

    var sTemp="f";var nLevel=0;
    while(eval(sTemp+".parentElement"))
      {
      nLevel++;
      sTemp+=".parentElement";
      }
    var bBreak=false;
    for(var j=nLevel;j>0;j--)
      {
      sTemp="f";
      for(var k=1;k<=j;k++)sTemp+=".parentElement";
      if(!bBreak)
      if (eval(sTemp).nodeName=="SPAN" && eval(sTemp).innerText==f.innerText)
        {
        newSpan=eval(sTemp);
        if(arrStyles||sClassName)copyStyleClass(newSpan,arrStyles,sClassName);
        else copyAttribute(newSpan,f);
        f.removeNode(false);
        bBreak=true;
        }
      }
    if(bBreak)
      {
      continue;
      }

    newSpan=oEditor.document.createElement("SPAN");
    if(arrStyles||sClassName)copyStyleClass(newSpan,arrStyles,sClassName);
    else copyAttribute(newSpan,f);
    
    var sHTML=f.innerHTML;
    sHTML=fixPathEncode(sHTML);    
    newSpan.innerHTML=sHTML;
    f.replaceNode(newSpan);
    fixPathDecode(oEditor);
    count--;

    /*** get first span selected ***/
    if(!oSpanStart)oSpanStart=newSpan;
    /*******************************/
    }

  /*** Restore selection ***/
  var rng = oEditor.document.selection.createRange();
  if(oSpanStart)
    {//WARNING: Jika tdk ada span, kemungkinan selection failed?
    rng.moveToElementText(oSpanStart);
    rng.select();
    }
  rng.moveEnd("character",nSelLength-rng.text.length);
  rng.select();

  //adjustments
  rng.moveEnd("character",nSelLength-rng.text.length);
  rng.select();
  rng.moveEnd("character",nSelLength-rng.text.length);
  rng.select();
  /**************************/
  };
/******** /NEW SPAN OPERATION *********/

/*** APPLY FORMATTING ***/
function doOnPaste()
  {
  this.isAfterPaste=true;
  this.saveForUndo();
  if(this.pasteTextOnCtrlV) 
    {
      this.doPasteText();
      return false;
    }
  };
function doPaste()
  {
  this.saveForUndo();
  if(this.pasteTextOnCtrlV) {
    this.doOnPaste();
  } else {
    this.doCmd("Paste");
  }
  //*** RUNTIME BORDERS ***
  this.runtimeBorder(false);
  //***********************
  };
function doCmd(sCmd,sOption)
  {
  if(!this.checkFocus())return;//Focus stuff

  if(sCmd=="Cut"||sCmd=="Copy"||sCmd=="Superscript"||sCmd=="Subscript"||
    sCmd=="Indent"||sCmd=="Outdent"||sCmd=="InsertHorizontalRule"||
    sCmd=="BlockDirLTR"||sCmd=="BlockDirRTL")
    this.saveForUndo();

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  var sType=oEditor.document.selection.type;
  var oTarget=(sType=="None"?oEditor.document:oSel);
  oTarget.execCommand(sCmd,false,sOption);
  realTime(this.oName);
  };
function applyParagraph(val)
  {
  this.hide();

  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  this.hide();
  oSel.select();
  this.saveForUndo();
  this.doCmd("FormatBlock",val);
  };
function applyBullets()
  {
  if(!this.checkFocus())return;//Focus stuff

  this.saveForUndo();
  this.doCmd("InsertUnOrderedList");
  
  this.tbar.btns["btnNumbering"+this.oName].setState(1);

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  var oElement=oSel.parentElement();
  while (oElement!=null&&oElement.tagName!="OL"&&oElement.tagName!="UL")
    {
    if(oElement.tagName=="BODY")return;
    oElement=oElement.parentElement;
    }
  oElement.removeAttribute("type",0);
  oElement.style.listStyleImage="";
  };
function applyNumbering()
  {
  if(!this.checkFocus())return;//Focus stuff

  this.saveForUndo();
  this.doCmd("InsertOrderedList");
  this.tbar.btns["btnBullets"+this.oName].setState(1);

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  var oElement=oSel.parentElement();
  while (oElement!=null&&oElement.tagName!="OL"&&oElement.tagName!="UL")
    {
    if(oElement.tagName=="BODY")return;
    oElement=oElement.parentElement;
    }
  oElement.removeAttribute("type",0);
  oElement.style.listStyleImage="";
  };
function applyJustifyLeft()
  {
  if(!this.checkFocus())return;//Focus stuff

  this.saveForUndo(); 
  this.doCmd("JustifyLeft");
  };
function applyJustifyCenter()
  {
  if(!this.checkFocus())return;//Focus stuff

  this.saveForUndo();
  this.doCmd("JustifyCenter");
  };
function applyJustifyRight()
  {
  if(!this.checkFocus())return;//Focus stuff

  this.saveForUndo();
  this.doCmd("JustifyRight");
  };
function applyJustifyFull()
  {
  if(!this.checkFocus())return;//Focus stuff

  this.saveForUndo();
  this.doCmd("JustifyFull");
  };
  
function applyBlockDirLTR()
  {
  if(!this.checkFocus())return;//Focus stuff

  this.doCmd("BlockDirLTR");
  };
function applyBlockDirRTL()
  {
  if(!this.checkFocus())return;//Focus stuff

  this.doCmd("BlockDirRTL");
  };
function doPasteText()
  {
  if(!this.checkFocus())return;//Focus stuff

  //paste from word temp storage
  var oWord=eval("idContentWord"+this.oName);
  oWord.document.designMode="on";
  oWord.document.open("text/html","replace");
  oWord.document.write("<html><head></head><body></body></html>");
  oWord.document.close();
  oWord.document.body.contentEditable=true;

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  this.saveForUndo();
  var oWord = eval("idContentWord"+this.oName);
  oWord.focus();
  oWord.document.execCommand("SelectAll");
  oWord.document.execCommand("Paste");
  
  var sHTML = oWord.document.body.innerHTML;
  //replace space between BR and text
  sHTML = sHTML.replace(/(<br>)/gi, "$1&lt;REPBR&gt;");
  sHTML = sHTML.replace(/(<\/tr>)/gi, "$1&lt;REPBR&gt;");
  sHTML = sHTML.replace(/(<\/div>)/gi, "$1&lt;REPBR&gt;");
  sHTML = sHTML.replace(/(<\/h1>)/gi, "$1&lt;REPBR&gt;");
  sHTML = sHTML.replace(/(<\/h2>)/gi, "$1&lt;REPBR&gt;");
  sHTML = sHTML.replace(/(<\/h3>)/gi, "$1&lt;REPBR&gt;");
  sHTML = sHTML.replace(/(<\/h4>)/gi, "$1&lt;REPBR&gt;");
  sHTML = sHTML.replace(/(<\/h5>)/gi, "$1&lt;REPBR&gt;");
  sHTML = sHTML.replace(/(<\/h6>)/gi, "$1&lt;REPBR&gt;");
  sHTML = sHTML.replace(/(<p>)/gi, "$1&lt;REPBR&gt;");
  sHTML=fixPathEncode(sHTML);
  oWord.document.body.innerHTML=sHTML;    
  fixPathDecode(oWord);
  oSel.pasteHTML(oWord.document.body.innerText.replace(/<REPBR>/gi, "<br>"));
  };
function insertCustomTag(index)
  {
  this.hide();

  if(!this.checkFocus())return;//Focus stuff

  this.insertHTML(this.arrCustomTag[index][1]);
  this.hide();
  this.focus();
  };
function insertHTML(sHTML)
  {
  this.setFocus();
  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  
  this.saveForUndo();

  var arrA = String(sHTML).match(/<A[^>]*>/ig);
  if(arrA)
    for(var i=0;i<arrA.length;i++)
      {
      sTmp = arrA[i].replace(/href=/,"href_iwe=");
      sHTML=String(sHTML).replace(arrA[i],sTmp);
      }

  var arrB = String(sHTML).match(/<IMG[^>]*>/ig);
  if(arrB)
    for(var i=0;i<arrB.length;i++)
      {
      sTmp = arrB[i].replace(/src=/,"src_iwe=");
      sHTML=String(sHTML).replace(arrB[i],sTmp);
      }

  //dummy tag added to fix IE bug. The pasteHTML function always remove comment tag 
  //from input if the comment is the first line.
  if(oSel.parentElement)oSel.pasteHTML("<span id='iwe_delete'>toberemoved</span>"+sHTML); 
  else oSel.item(0).outerHTML=sHTML;

  var toRemoved = oEditor.document.getElementById("iwe_delete");
  if(toRemoved) toRemoved.removeNode(true);

  for(var i=0;i<oEditor.document.all.length;i++)
    {
    var elm = oEditor.document.all[i];
    if(elm.nodeType==1) 
      {
        
        if(elm.getAttribute("href_iwe"))
          {
          elm.href=elm.getAttribute("href_iwe");
          elm.removeAttribute("href_iwe",0);
          }
        if(elm.getAttribute("src_iwe"))
          {
          elm.src=elm.getAttribute("src_iwe");
          elm.removeAttribute("src_iwe",0);
          }
      }
      
    }
    
  this.bookmarkSelection();  
  };
function insertLink(url,title,target)
  {
  this.setFocus();
  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();

  this.saveForUndo();

  if(oSel.parentElement)
    {
    if(oSel.text=="")
      {
      var oSelTmp=oSel.duplicate();
      if(title!="" && title!=undefined) oSel.text=title;
      else oSel.text=url;
      oSel.setEndPoint("StartToStart",oSelTmp);
      oSel.select();
      }
    }
  oSel.execCommand("CreateLink",false,url);

  if (oSel.parentElement) oEl=GetElement(oSel.parentElement(),"A");
  else oEl=GetElement(oSel.item(0),"A");
  if(oEl)
    {
    if(target!="" && target!=undefined)oEl.target=target;
    }
  this.bookmarkSelection();
  };
function clearAll()
  {
  if(confirm(getTxt("Are you sure you wish to delete all contents?"))==true)
    {
    var oEditor=eval("idContent"+this.oName);
    this.saveForUndo();
    oEditor.document.body.innerHTML="";
    }
  };
function applySpan()
  {
  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  var sType=oEditor.document.selection.type;
  if(sType=="Control"||sType=="None")return;

  sHTML=oSel.htmlText;

  var oParent=oSel.parentElement();
  if(oParent)
  if(oParent.innerText==oSel.text)
    {
    /*
    for(var j=0;j<arrTmp2.length;j++)
      {
      if(arrTmp2[j]==oParent)
        {
        alert(arrTmp2[j].tagName)
        }
      }*/
    if(oParent.tagName=="SPAN")
      {
      idSpan=oParent;
      return idSpan;
      }
    }

  var arrA = String(sHTML).match(/<A[^>]*>/ig);
  if(arrA)
    for(var i=0;i<arrA.length;i++)
      {
      sTmp = arrA[i].replace(/href=/,"href_iwe=");
      sHTML=String(sHTML).replace(arrA[i],sTmp);
      }

  var arrB = String(sHTML).match(/<IMG[^>]*>/ig);
  if(arrB)
    for(var i=0;i<arrB.length;i++)
      {
      sTmp = arrB[i].replace(/src=/,"src_iwe=");
      sHTML=String(sHTML).replace(arrB[i],sTmp);
      }

  oSel.pasteHTML("<SPAN id='idSpan__abc'>"+sHTML+"</SPAN>");
  var idSpan=oEditor.document.all.idSpan__abc;

  var oSelRange=oEditor.document.body.createTextRange();
  oSelRange.moveToElementText(idSpan);
  oSel.setEndPoint("StartToStart",oSelRange);
  oSel.setEndPoint("EndToEnd",oSelRange);
  oSel.select();

  for(var i=0;i<oEditor.document.all.length;i++)
    {
    if(oEditor.document.all[i].getAttribute("href_iwe"))
      {
      oEditor.document.all[i].href=oEditor.document.all[i].getAttribute("href_iwe");
      oEditor.document.all[i].removeAttribute("href_iwe",0);
      }
    if(oEditor.document.all[i].getAttribute("src_iwe"))
      {
      oEditor.document.all[i].src=oEditor.document.all[i].getAttribute("src_iwe");
      oEditor.document.all[i].removeAttribute("src_iwe",0);
      }
    }

  idSpan.removeAttribute("id",0);
  return idSpan;
  };
function makeAbsolute()
  {
  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  this.saveForUndo();

  if(oSel.parentElement)
    {
    var oElement=oSel.parentElement();
    oElement.style.position="absolute";
    }
  else
    this.doCmd("AbsolutePosition");
  };
//~~~~~~~~~~~~~
function expandSelection()
  {
  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();
  if(oSel.text!="")return;

  oSel.expand("word");
  oSel.select();
  if(oSel.text.substr(oSel.text.length*1-1,oSel.text.length)==" ")
    {
    oSel.moveEnd("character",-1);
    oSel.select();
    }
  };
function selectParagraph()
  {
  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();

  if(oSel.parentElement)
    {
    if(oSel.text=="")
      {
      var oElement=oSel.parentElement();
      while (oElement!=null&&
        oElement.tagName!="H1"&&oElement.tagName!="H2"&&
        oElement.tagName!="H3"&&oElement.tagName!="H4"&&
        oElement.tagName!="H5"&&oElement.tagName!="H6"&&
        oElement.tagName!="PRE"&&oElement.tagName!="P"&&
        oElement.tagName!="DIV")
        {
        if(oElement.tagName=="BODY")return;
        oElement=oElement.parentElement;
        }
      var oSelRange = oEditor.document.body.createControlRange();
      try
        {
        oSelRange.add(oElement);
        oSelRange.select();
        }
      catch(e)
        {
        var oSelRange = oEditor.document.body.createTextRange();
        try{oSelRange.moveToElementText(oElement);
          oSelRange.select()
          }catch(e){;}
        }
      }
    }
  };

/*** Table Insert Dropdown ***/
function doOver_TabCreate()
  {
  var oTD=event.srcElement;
  var oTable=oTD.parentElement.parentElement.parentElement;
  var nRow=oTD.parentElement.rowIndex;
  var nCol=oTD.cellIndex;
  var rows=oTable.rows;
  rows[rows.length-1].childNodes[0].innerHTML="<div align=right>"+(nRow*1+1) + " x " + (nCol*1+1) + " " + getTxt("Table Dimension Text") + " ...  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style='text-decoration:underline'>"+ getTxt("Table Advance Link") +"</span>&nbsp;</div>";
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
  event.cancelBubble=true;
  };
function doOut_TabCreate()
  {
  var oTable=event.srcElement;
  if(oTable.tagName!="TABLE")return;
  var rows=oTable.rows;
  rows[rows.length-1].childNodes[0].innerText=getTxt("Advanced Table Insert");
  for(var i=0;i<rows.length-1;i++)
    {
    var oRow=rows[i];
    for(var j=0;j<oRow.childNodes.length;j++)
      {
      var oCol=oRow.childNodes[j];
      oCol.style.backgroundColor="#ffffff";
      }
    }
  event.cancelBubble=true;
  };
function doRefresh_TabCreate()
  {
  var oTable=eval("dropTableCreate"+this.oName);
  var rows=oTable.rows;
  rows[rows.length-1].childNodes[0].innerText=getTxt("Advanced Table Insert");
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
function doClick_TabCreate()
  {
  this.hide();

  if(!this.checkFocus())return;//Focus stuff

  var oEditor=eval("idContent"+this.oName);
  var oSel=oEditor.document.selection.createRange();

  var oTD=event.srcElement;
  var nRow=oTD.parentElement.rowIndex+1;
  var nCol=oTD.cellIndex+1;

  this.saveForUndo();

  var sHTML="<table style='border-collapse:collapse;width:100%;'>";
  for(var i=1;i<=nRow;i++)
    {
    sHTML+="<tr>";
    for(var j=1;j<=nCol;j++)
      {
      sHTML+="<td></td>";
      }
    sHTML+="</tr>";
    }
  sHTML+="</table>";

  if(oSel.parentElement) {
    oSel.collapse();    
    oSel.pasteHTML(sHTML);
  } else
    oSel.item(0).outerHTML = sHTML;

  realTime(this.oName);

  //*** RUNTIME STYLES ***
  this.runtimeBorder(false);
  this.runtimeStyles();
  //***********************
  };

/*** doKeyPress ***/
function doKeyPress(evt,oName)
  {
  if(!eval(oName).arrUndoList[0]){eval(oName).saveForUndo();}//pengganti saveForUndo_First

  if(evt.ctrlKey)
    {
    if(evt.keyCode==89)
      {//CTRL-Y (Redo)
      if (!evt.altKey) eval(oName).doRedo();
      }
    if(evt.keyCode==90)
      {//CTRL-Z (Undo)
      if (!evt.altKey) eval(oName).doUndo();
      }
    if(evt.keyCode==65)
      {//CTRL-A (Select All) => spy jalan di modal dialog
      if (!evt.altKey) eval(oName).doCmd("SelectAll");
      }
    if(evt.keyCode==66 || evt.keyCode==73 || evt.keyCode==85)
      {//CTRL-B (Bold, Italic, Underlined)
      if (!evt.altKey) eval(oName).saveForUndo();
      }
    }

  if(evt.keyCode==37||evt.keyCode==38||evt.keyCode==39||evt.keyCode==40)//Arrow
    {
    eval(oName).saveForUndo();//Save for Undo
    }
  if(evt.keyCode==13)
    {
    if(eval(oName).useDIV && !eval(oName).useBR)
      {
      var oSel=document.selection.createRange();

      if(oSel.parentElement)
        {
        eval(oName).saveForUndo();//Save for Undo

        if(GetElement(oSel.parentElement(),"FORM"))
          {
          var oSel=document.selection.createRange();
          oSel.pasteHTML('<br>');
          evt.cancelBubble=true;
          evt.returnValue=false;
          oSel.select();
          oSel.moveEnd("character", 1);
          oSel.moveStart("character", 1);
          oSel.collapse(false);
          return false;
          }
        else
          {
          var oEl = GetElement(oSel.parentElement(),"H1");
          if(!oEl) oEl = GetElement(oSel.parentElement(),"H2");
          if(!oEl) oEl = GetElement(oSel.parentElement(),"H3");
          if(!oEl) oEl = GetElement(oSel.parentElement(),"H4");
          if(!oEl) oEl = GetElement(oSel.parentElement(),"H5");
          if(!oEl) oEl = GetElement(oSel.parentElement(),"H6");
          if(!oEl) oEl = GetElement(oSel.parentElement(),"PRE");
          if(!oEl)eval(oName).doCmd("FormatBlock","<div>");
          return true;
          }
        }
      }
    if((eval(oName).useDIV && eval(oName).useBR)||
      (!eval(oName).useDIV && eval(oName).useBR))
      {
      var oSel=document.selection.createRange();
      oSel.pasteHTML('<br>');
      evt.cancelBubble=true;
      evt.returnValue=false;
      oSel.select();
      oSel.moveEnd("character", 1);
      oSel.moveStart("character", 1);
      oSel.collapse(false);
      return false;
      }
    eval(oName).saveForUndo();//Save for Undo
    }
  eval(oName).onKeyPress()
  };

/*** FullScreen **/
function fullScreen()
  {
  this.hide();

  var oEditor=eval("idContent"+this.oName);

  if(this.stateFullScreen)
    {
    this.onNormalScreen();
    this.stateFullScreen=false;
    //document.body.style.overflow="";

    eval("idArea"+this.oName).style.position="";
    eval("idArea"+this.oName).style.top=0;
    eval("idArea"+this.oName).style.left=0;
    eval("idArea"+this.oName).style.width=this.width;
    eval("idArea"+this.oName).style.height=this.height;
    
    var ifrm=document.getElementById("idFixZIndex"+this.oName);
    ifrm.style.top=0;
    ifrm.style.left=0;
    ifrm.style.width=0;
    ifrm.style.height=0;
    ifrm.style.display="none";
    
    //fix undisplayed content (new)
    oEditor.document.body.style.lineHeight="1.2";
    window.setTimeout("eval('idContent"+this.oName+"').document.body.style.lineHeight='';",0);

    for(var i=0;i<oUtil.arrEditor.length;i++)
      {
      if(oUtil.arrEditor[i]!=this.oName)eval("idArea"+oUtil.arrEditor[i]).style.display="block";
      }
    }
  else
    {
    this.onFullScreen();
    this.stateFullScreen=true;
    scroll(0,0);
    //document.body.style.overflow="hidden";

    eval("idArea"+this.oName).style.position="absolute";
    eval("idArea"+this.oName).style.top=0;
    eval("idArea"+this.oName).style.left=0;
    eval("idArea"+this.oName).style.zIndex=2000;
    
    var numOfBrk=0;
    for(var j=0;j<this.buttonMap.length;j++)if(this.buttonMap[j]=="BRK")numOfBrk++;

    nToolbarHeight=(numOfBrk+1)*27;

    if (document.compatMode && document.compatMode!="BackCompat")
      {
      //using doctype
      var html=document.documentElement;
      try
        {
        w=(document.body.offsetWidth);
        document.body.style.height="100%";
        h=html.clientHeight-nToolbarHeight;
        document.body.style.height="";
        }
      catch(e)
        {
        w=(document.body.offsetWidth+20);
        document.body.style.height="100%";
        h=html.clientHeight-nToolbarHeight;
        document.body.style.height="";
        }
      }
    else
      {
      if(document.body.style.overflow=="hidden")
        {
        w=document.body.offsetWidth;
        }
      else
        {
        w=document.body.offsetWidth-22;
        }
      h=document.body.offsetHeight-4;
      }

    if (document.compatMode && document.compatMode!="BackCompat")
      {
      //using doctype => need adjustment. TODO: create as properties.
      w=w;
      h=h-13;
      }
      
    eval("idArea"+this.oName).style.width=w;
    eval("idArea"+this.oName).style.height=h;
    
    var ifrm=document.getElementById("idFixZIndex"+this.oName);
    ifrm.style.top=0;
    ifrm.style.left=0;
    ifrm.style.width=w;
    ifrm.style.height=h;
    ifrm.style.display="";
    ifrm.style.zIndex = 1900;

    for(var i=0;i<oUtil.arrEditor.length;i++)
      {
      if(oUtil.arrEditor[i]!=this.oName)eval("idArea"+oUtil.arrEditor[i]).style.display="none";
      }
    
    //fix undisplayed content (new)
    oEditor.document.body.style.lineHeight="1.2";
    window.setTimeout("eval('idContent"+this.oName+"').document.body.style.lineHeight='';",0);

    oEditor.focus();
    }
  
  var idStyles=document.getElementById("idStyles"+this.oName);
  idStyles.innerHTML="";
  };

/*** Show/Hide Dropdown ***/
function hide()
  {
  hideAllDD();

  this.oColor1.hide();
  this.oColor2.hide();
  
  //additional
  if(this.btnTable)this.doRefresh_TabCreate();
  };

function convertBorderWidth(width){
  return eval(width.substr(0,width.length-2));
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
      f.iconPath = oUtil.scriptPath + "icons/";
      f.show({width:wd+"px", height:hg+"px",overlay:ov,center:true, url:url, openerWin:p, options:opt});
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
    var oNode=oEl.childNodes(i);
    
    if(oNode.parentNode!=oEl)continue; //add this line
    
    if(oNode.nodeType==1)//tag
      {
      var sTagName = oNode.nodeName;
            var sCloseTag = oNode.outerHTML;
            if (sCloseTag.indexOf("<?xml:namespace") > -1) sCloseTag=sCloseTag.substr(sCloseTag.indexOf(">")+1);
            sCloseTag = sCloseTag.substring(1, sCloseTag.indexOf(">"));
            if (sCloseTag.indexOf(" ")>-1) sCloseTag=sCloseTag.substring(0, sCloseTag.indexOf(" "));

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
        s=oNode.outerHTML;

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

        if(sTagName=="BODY") {
          var ht = oNode.outerHTML;
          s=ht.substring(0, ht.indexOf(">")+1);
        } else {
          var oNode2=oNode.cloneNode();
          if (oNode.checked) oNode2.checked=oNode.checked;
          if (oNode.selected) oNode2.selected=oNode.selected;
          s=oNode2.outerHTML.replace(/<\/[^>]*>/,"");
        }

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
        s=s.replace(/(<hr[^>]*)(noshade)/ig,"$1noshade=\"noshade\"");
        s=s.replace(/(<input[^>]*)(checked)/ig,"$1checked=\"checked\"");
        s=s.replace(/(<select[^>]*)(multiple)/ig,"$1multiple=\"multiple\"");
        s=s.replace(/(<option[^>]*)(selected)/ig,"$1selected=\"true\"");
        s=s.replace(/(<input[^>]*)(readonly)/ig,"$1readonly=\"readonly\"");
        s=s.replace(/(<input[^>]*)(disabled)/ig,"$1disabled=\"disabled\"");
        s=s.replace(/(<td[^>]*)(nowrap )/ig,"$1nowrap=\"nowrap\" ");
        s=s.replace(/(<td[^>]*)(nowrap\>)/ig,"$1nowrap=\"nowrap\"\>");

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
          s=oNode.outerHTML;          
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
              sT + "//<![CDATA[\n"+
              sT + s + "\n"+
              sT + "//]]>\n"+sT;
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
              sT + s + "\n"+
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
            {
            sHTML+=recur(oNode,sT+"\t");
            }

          /*** tabs ***/
          if(sTagName!="TEXTAREA")sHTML+=lineBreak1(sTagName)[2];
          if(sTagName!="TEXTAREA")if(lineBreak1(sTagName)[2] !="")sHTML+=sT;//If new line, use base Tabs
          /************/

          //sHTML+="</" + sTagName.toLowerCase() + ">";
          //sHTML+="</" + sCloseTag.toLowerCase() + ">";//spy bisa <a:b>
          if (sCloseTag.indexOf(":") >= 0)  //deteksi jika tag tersebut adalah custom tag.
            {
            sHTML+="</" + sCloseTag.toLowerCase() + ">";//spy bisa <a:b>
            } 
          else 
            {
            sHTML+="</" + sTagName.toLowerCase() + ">";
            }
          }
        }
      }
    else if(oNode.nodeType==3)//text
      {
      sHTML+= fixVal(oNode.nodeValue);
      }
    else if(oNode.nodeType==8)
      {
      if(oNode.outerHTML.substring(0,2)=="<"+"%")
        {//server side script
        var sTmp=(oNode.outerHTML.substring(2));
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
        var sTmp=oNode.nodeValue;
        sTmp = sTmp.replace(/^\s+/,"").replace(/\s+$/,"");
        var sT="";
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

/*** TOOLBAR ICONS ***/

function fixPathEncode(sHTML) {

  var arrA = String(sHTML).match(/<A[^>]*>/g);
  if(arrA)
  for(var i=0;i<arrA.length;i++)
    {
    sTmp = arrA[i].replace(/href=/,"href_iwe=");
    sHTML=String(sHTML).replace(arrA[i],sTmp);
    }
  var arrB = String(sHTML).match(/<IMG[^>]*>/g);
  if(arrB)
  for(var i=0;i<arrB.length;i++)
    {
    sTmp = arrB[i].replace(/src=/,"src_iwe=");
    sHTML=String(sHTML).replace(arrB[i],sTmp);
    }
  var arrC = String(sHTML).match(/<AREA[^>]*>/ig);
  if(arrC)
  for(var i=0;i<arrC.length;i++)
    {
    sTmp = arrC[i].replace(/href=/,"href_iwe=");
    sHTML=String(sHTML).replace(arrC[i],sTmp);
    }    
  return sHTML;
};

function fixPathDecode(oEditor) {
  for(var i=0;i<oEditor.document.all.length;i++)
  {
  if(oEditor.document.all[i].getAttribute("href_iwe"))
    {
    oEditor.document.all[i].href=oEditor.document.all[i].getAttribute("href_iwe");
    oEditor.document.all[i].removeAttribute("href_iwe",0);
    }
  if(oEditor.document.all[i].getAttribute("src_iwe"))
    {
    oEditor.document.all[i].src=oEditor.document.all[i].getAttribute("src_iwe");
    oEditor.document.all[i].removeAttribute("src_iwe",0);
    }
  }        
};

function tbAction(tb, id, edt, sfx) {
  var e=edt, oN=sfx, btn=id.substring(0, id.lastIndexOf(oN));
  
  switch(btn) {
    case "btnSave": e.onSave();break;
    case "btnFullScreen": e.fullScreen(); break;
    case "btnPrint": e.focus();edt.doCmd("Print"); break;
    case "btnSearch": e.hide(); modelessDialogShow(e.scriptPath+"search.htm",375,163); break;
    case "btnSpellCheck": e.hide(); 
      if(e.spellCheckMode=="ieSpell") modelessDialogShow(e.scriptPath+"spellcheck.htm",500,222); 
      else if(e.spellCheckMode=="NetSpell") checkSpellingById("idContent"+edt.oName);
      break;
    case "btnCut": e.doCmd("Cut"); break;
    case "btnCopy": e.doCmd("Copy"); break;
    case "btnUndo": e.doUndo(); break;
    case "btnRedo": e.doRedo(); break;
    case "btnBold": e.applyBold(); break;
    case "btnItalic": e.applyItalic(); break;
    case "btnUnderline": e.applyLine("underline"); break;
    case "btnStrikethrough": e.applyLine("line-through"); break;
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
    case "btnCharacters": e.hide();modelessDialogShow(e.scriptPath+"characters.htm",495,162); break;
    case "btnLine": e.doCmd("InsertHorizontalRule"); break;
    case "btnRemoveFormat": e.doClean(); break;
    case "btnHTMLFullSource": setActiveEditor(oN);e.hide();modalDialogShow(e.scriptPath+"source_html_full.htm",600,450); break;
    case "btnHTMLSource": setActiveEditor(oN);e.hide();modalDialogShow(e.scriptPath+"source_html.htm",600,450); break;
    case "btnXHTMLFullSource": setActiveEditor(oN);e.hide();modalDialogShow(e.scriptPath+"source_xhtml_full.htm",600,450); break;
    case "btnXHTMLSource": setActiveEditor(oN);e.hide();modalDialogShow(e.scriptPath+"source_xhtml.htm",600,450); break;
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
      setActiveEditor(oN);
      modalDialogShow(e.scriptPath+"preview.htm",640,480); 
      break;
    case "btnPreview2": 
      setActiveEditor(oN);
      modalDialogShow(e.scriptPath+"preview.htm",800,600); 
      break;
    case "btnPreview3": 
      setActiveEditor(oN);
      modalDialogShow(e.scriptPath+"preview.htm",1024,768); 
      break;
    case "btnTextFormatting": modelessDialogShow(e.scriptPath+"text1.htm",511,470); break;
    case "btnParagraphFormatting": modelessDialogShow(e.scriptPath+"paragraph.htm",460,284); break;
    case "btnListFormatting": modelessDialogShow(e.scriptPath+"list.htm",270,335); break;
    case "btnBoxFormatting": modelessDialogShow(e.scriptPath+"box.htm",498,395); break;
    case "btnCssText": modelessDialogShow(e.scriptPath+"styles_cssText.htm",360,332); break;
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
    case "mnuTableEdit": modelessDialogShow(e.scriptPath+"table_edit.htm",400,430); break;
    case "mnuCellEdit": modelessDialogShow(e.scriptPath+"table_editCell.htm",427,450); break;
    case "btnPasteClip": e.doPaste(); break;
    case "btnPasteWord": modelessDialogShow(e.scriptPath+"paste_word.htm",400,280); break;
    case "btnPasteText": e.doPasteText(); break;
  }
  
  var idx=0;
  if(btn.indexOf("btnParagraphFormatting")!=-1) {
  } else
  if(btn.indexOf("btnParagraph")!=-1) {
    idx=btn.substr(btn.indexOf("_")+1);
    e.applyParagraph("<"+e.arrParagraph[parseInt(idx)][1]+">");
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
    cH = edtObj.childNodes[0].offsetHeight -
      edtObj.rows[0].cells[0].childNodes[0].offsetHeight -
        (this.useTagSelector ? 20 : 0);
  }

  if (!this.minHeight) this.minHeight = parseInt(cH,10);

  var newHeight = parseInt(cH, 10) + v;
  
  //if(newHeight < this.minHeight) {
  //  newHeight = this.minHeight;
  //}
  
  this.height = newHeight + "px";
  edtObj.style.height = this.height;

};
