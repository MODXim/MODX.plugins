/***********************************************************
    Copyright © 2007, Yusuf Wiryonoputro. All rights reserved.
************************************************************/

var oUtil=new webUtil();
function webUtil()
    {
    this.arrWebDrop=[];
    }

var oActiveBox;
function dropShow(oEl,box)
    {
    if(box.style.display=="block")
        {
        box.style.display="none";
        return;
        }
    hide();
    
    var inp = document.getElementById("inp"+this.oName);
    var sel = document.getElementById("sel"+this.oName);
    if(inp.value!=sel.value)
        {
        sel.selectedIndex=-1
        }
    for(var i=0;i<sel.options.length;i++)
        {
        if(inp.value==sel.options[i].innerHTML)
            {
            sel.selectedIndex=i;
            }
        }
    
    var nTop=0;
    var nLeft=0;

    oElTmp=oEl;
    while(oElTmp.tagName!="BODY" )
        {
        if(oElTmp.style.top!="")
            nTop+=oElTmp.style.top.substring(1,oElTmp.style.top.length-2)*1;
        else nTop+=oElTmp.offsetTop;
        oElTmp = oElTmp.offsetParent;
        }

    oElTmp=oEl;
    while(oElTmp.tagName!="BODY" && oElTmp.tagName!="HTML")
        {
        if(oElTmp.style.left!="")
            nLeft+=oElTmp.style.left.substring(1,oElTmp.style.left.length-2)*1;
        else nLeft+=oElTmp.offsetLeft;
        oElTmp=oElTmp.offsetParent;
        }

    box.style.left=nLeft-this.width;
    box.style.top=nTop+this.height;
    
    box.style.display="block";
    
    box.childNodes[0].focus();
    
    oActiveBox=box;
    }
function hide()//independent
    {
    if(oActiveBox)oActiveBox.style.display="none";
    }

function webDrop(oName)
    {
    this.oName=oName;
    this.size;
    this.width=140;//120
    this.height=17;
    this.arrValue=[];
    this.arrCaption=[]; 
    //this.onChange=function(){return true;};
    this.onChange=new Function("preview()");
    this.getValue=getValue;
    this.setValue=setValue;
    this.dropShow=dropShow;
    this.render=render;
    this.focus=inpFocus;
    this.defaultValue=0;
    this.pickValue=pickValue;
    }
function getValue()
    {
    return document.getElementById("inp"+this.oName).value;
    }
function setValue(sValue)
    {
    document.getElementById("inp"+this.oName).value=sValue;
    }
function render()
    {
    if(this.arrValue.length>0&&this.arrCaption.length==0)
        this.arrCaption=this.arrValue;
    if(this.arrValue.length>=12)this.size=12;
    else this.size=this.arrValue.length;
    
    var s="";   
    s+="<table cellpadding=0 cellspacing=0><tr><td>"+
        "<input type=text onfocus=\"this.select()\" onkeyup=\""+this.oName+".onChange();\" onblur=\""+this.oName+".onChange();\" name=inp"+this.oName+" id=inp"+this.oName+" style='border:#d4d0c8 1px solid;padding-left:3px;width:"+this.width+";height:"+this.height+"' onclick=\"hide()\" value=\""+this.defaultValue+"\">"+
        "</td><td>"+
        "<input type=button style='cursor:default;border:none;background:url(dropbtn.gif);width:13;height:"+this.height+";' onclick=\""+this.oName+".dropShow(this,document.getElementById('div"+this.oName+"'))\" >"+
        "<div id='div"+this.oName+"' style=\"display:none;position:absolute;\"><select name=sel"+this.oName+" id=sel"+this.oName+" multiple=multiple size="+this.size+" style='border:#000000 1px solid;width:"+(this.width+13)+";' onchange=\"hide();"+this.oName+".pickValue();"+this.oName+".onChange();\" onblur=\"hide();\">";
    for(var i=0;i<this.arrValue.length;i++)
        {
        s+="<option value=\""+this.arrValue[i]+"\">"+this.arrCaption[i]+"</option>";
        }
    s+="</select></div></td></tr></table>";
    document.write(s);
    
    oUtil.arrWebDrop.push(this.oName)
    }
function pickValue()
    {
    var inp = document.getElementById("inp"+this.oName);
    var sel = document.getElementById("sel"+this.oName);
    if(sel.value=="<length>")
        {
        selectedObjectWebDropObject = this.oName;
        modalDialogShow("length.htm",200,150)
        }
    else if(sel.value=="<percentage>")
        {
        selectedObjectWebDropObject = this.oName;
        modalDialogShow("percent.htm",200,150)
        }
    else if(sel.value=="<color>")
        {
        if(inp.name=="inpoColor")
            oColor1.show(inp);
        if(inp.name=="inpoBackgroundColor")
            oColor2.show(inp);
        if(inp.name=="inpoBorderColor")
            oColor3.show(inp);
        if(inp.name=="inpoBorderTopColor")
            oColor4.show(inp);
        if(inp.name=="inpoBorderBottomColor")
            oColor5.show(inp);
        if(inp.name=="inpoBorderLeftColor")
            oColor6.show(inp);
        if(inp.name=="inpoBorderRightColor")
            oColor7.show(inp);
        }
    else if(sel.value=="<url>")
        {
        selectedObjectWebDropObject = this.oName;
        modalDialogShow2("url.htm",260,150)
        }
    else 
        {
        inp.value=sel.value;
        }
    }

var activeModalWin;
var selectedObjectWebDropObject;
function setDialogValue(v) {

    var inp = document.getElementById("inp"+selectedObjectWebDropObject);
    inp.value = v;
    var obj = eval(selectedObjectWebDropObject);
    obj.onChange();
    
    selectedObjectWebDropObject= "";
}

function modelessDialogShow(url,width,height)
    {
    var left = screen.availWidth/2 - width/2;
    var top = screen.availHeight/2 - height/2;
    window.open(url, "", "dependent=yes,width="+width+"px,height="+height+",left="+left+",top="+top);
    }
    
function modalDialogShow(url,width,height)
    {
    var left = screen.availWidth/2 - width/2;
    var top = screen.availHeight/2 - height/2;
    activeModalWin = window.open(url, "", "width="+width+"px,height="+height+"px,left="+left+",top="+top);
    window.onfocus = function(){if (activeModalWin.closed == false){activeModalWin.focus();};};
        
    }
    
function modalDialogShow2(url,width,height)
    {
    var left = screen.availWidth/2 - width/2;
    var top = screen.availHeight/2 - height/2;
    activeModalWin = window.open(url, "", "width="+width+"px,height="+height+"px,left="+left+",top="+top);
    window.onfocus = function(){if (activeModalWin.closed == false){activeModalWin.focus();};};

    }
    
function inpFocus()
    {
    document.getElementById("inp"+this.oName).focus();
    }