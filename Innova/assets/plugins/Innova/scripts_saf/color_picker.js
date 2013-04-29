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
    this.RENDER=drawColorPicker;
    }
    
function drawColorPicker()
    {   
    var arrColors=[["#800000","#8b4513","#006400","#2f4f4f","#000080","#4b0082","#800080","#000000"],
                ["#ff0000","#daa520","#6b8e23","#708090","#0000cd","#483d8b","#c71585","#696969"],
                ["#ff4500","#ffa500","#808000","#4682b4","#1e90ff","#9400d3","#ff1493","#a9a9a9"],
                ["#ff6347","#ffd700","#32cd32","#87ceeb","#00bfff","#9370db","#ff69b4","#dcdcdc"],
                ["#ffdab9","#ffffe0","#98fb98","#e0ffff","#87cefa","#e6e6fa","#dda0dd","#ffffff"]]
    var sHTMLColor="<table id=dropColor"+this.oRenderName+" style=\"z-index:1;display:none;position:absolute;border:#9b95a6 1px solid;cursor:default;background-color:#E9E8F2;padding:2px\" unselectable=on cellpadding=0 cellspacing=0 width=145px><tr><td unselectable=on>"
    sHTMLColor+="<table align=center cellpadding=0 cellspacing=0 border=0 unselectable=on>";
    for(var i=0;i<arrColors.length;i++)
        {
        sHTMLColor+="<tr>";
        for(var j=0;j<arrColors[i].length;j++)
            sHTMLColor+="<td onclick=\""+this.oName+".color='"+arrColors[i][j]+"';"+this.oName+".onPickColor();"+this.oName+".currColor='"+arrColors[i][j]+"';"+this.oName+".hideAll()\" onmouseover=\"this.style.border='#777777 1px solid'\" onmouseout=\"this.style.border='#E9E8F2 1px solid'\" style=\"cursor:default;padding:1px;border:#E9E8F2 1px solid;\" unselectable=on>"+
                "<table style='margin:0px;width:13px;height:13px;background:"+arrColors[i][j]+";border:white 1px solid' cellpadding=0 cellspacing=0 unselectable=on>"+
                "<tr><td unselectable=on></td></tr>"+
                "</table></td>";
        sHTMLColor+="</tr>";        
        }
    
    //~~~ custom colors ~~~~
    sHTMLColor+="<tr><td colspan=8 id=idCustomColor"+this.oRenderName+"></td></tr>";
    
    //~~~ remove color & more colors ~~~~
    sHTMLColor+= "<tr>";
    sHTMLColor+= "<td unselectable=on>"+
        "<table style='margin-left:1px;width:14px;height:14px;background:#E9E8F2;' cellpadding=0 cellspacing=0 unselectable=on>"+
        "<tr><td onclick=\""+this.oName+".onRemoveColor();"+this.oName+".currColor='';"+this.oName+".hideAll()\" onmouseover=\"this.style.border='#777777 1px solid'\" onmouseout=\"this.style.border='white 1px solid'\" style=\"cursor:default;padding:1px;border:white 1px solid;font-family:verdana;font-size:10px;font-color:black;line-height:9px;\" align=center valign=top unselectable=on>x</td></tr>"+
        "</table></td>";
    sHTMLColor+= "<td colspan=7 unselectable=on>"+
        "<table style='margin:1px;width:117px;height:16px;background:#E9E8F2;border:white 1px solid' cellpadding=0 cellspacing=0 unselectable=on>"+
        "<tr><td id='"+this.oName+"moreColTd' onclick=\""+this.oName+".onMoreColor();"+this.oName+".hideAll();parent.modalDialogShow('"+this.url+"?" +this.oName+ "', 455, 455, window,{'oName':'"+this.oName+"'})\" onmouseover=\"this.style.border='#777777 1px solid';this.style.background='#8d9aa7';this.style.color='#ffffff'\" onmouseout=\"this.style.border='#E9E8F2 1px solid';this.style.background='#E9E8F2';this.style.color='#000000'\" style=\"cursor:default;font-family:verdana;font-size:9px;font-color:black;line-height:9px;padding:1px\" align=center valign=top nowrap unselectable=on>"+this.txtMoreColors+"</td></tr>"+
        "</table></td>";
    sHTMLColor+= "</tr>";
    
    sHTMLColor+= "</table>";            
    sHTMLColor+="</td></tr></table>";
    document.write(sHTMLColor);
    }
    
function refreshCustomColor()
    {
    var arg = eval(dialogArgument[0]);
    var arg2 = eval(dialogArgument[1]);
    if(arg.oUtil)//[CUSTOM]
        this.customColors=arg.oUtil.obj.customColors;//[CUSTOM] (Get from public definition)
    else //text2.htm [CUSTOM]
        this.customColors=arg2.oUtil.obj.customColors;//[CUSTOM] (Get from public definition)

    if(this.customColors.length==0)
        {
        document.getElementById("idCustomColor"+this.oRenderName).innerHTML="";
        return;
        }
    sHTML="<table cellpadding=0 cellspacing=0 width=100%><tr><td colspan=8 style=\"font-family:verdana;font-size:9px;font-color:black;line-height:9px;padding:1\">"+this.txtCustomColors+":</td></tr></table>"
    sHTML+="<table cellpadding=0 cellspacing=0><tr>";   
    for(var i=0;i<this.customColors.length;i++)
        {
        if(i<22)
            {
            if(i==8||i==16||i==24||i==32)sHTML+="</tr></table><table cellpadding=0 cellspacing=0><tr>"  
            sHTML+="<td onclick=\""+this.oName+".color='"+this.customColors[i]+"';"+this.oName+".onPickColor()\" onmouseover=\"this.style.border='#777777 1px solid'\" onmouseout=\"this.style.border='#E9E8F2 1px solid'\" style=\"cursor:default;padding:1px;border:#E9E8F2 1px solid;\" unselectable=on>"+
                "   <table  style='margin:0;width:13;height:13;background:"+this.customColors[i]+";border:white 1px solid' cellpadding=0 cellspacing=0 unselectable=on>"+
                "   <tr><td unselectable=on></td></tr>"+
                "   </table>"+
                "</td>";
            }           
        }
    sHTML+="</tr></table>";
    document.getElementById("idCustomColor"+this.oRenderName).innerHTML=sHTML;
    }
function showColorPicker(oEl)
    {
    this.onShow();
    
    this.hideAll();

    var box=document.getElementById("dropColor"+this.oRenderName);

    //remove hilite
    var allTds = box.getElementsByTagName("TD");
    for (var i = 0; i<allTds.length; i++) {
        allTds[i].style.border="#E9E8F2 1px solid";
        if (allTds[i].id==this.oName+"moreColTd") {
            allTds[i].style.border="#E9E8F2 1px solid";
            allTds[i].style.background="#E9E8F2";
            allTds[i].style.color="#000000";
        }
    }

    box.style.display="block";
    var nTop=0;
    var nLeft=0;

    oElTmp=oEl;
    while(oElTmp.tagName!="BODY" && oElTmp.tagName!="HTML")
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
    
    if(this.align=="left")
        box.style.left=nLeft;
    else//right
        box.style.left=nLeft-143+oEl.offsetWidth;
        
    //box.style.top=nTop+1;//[CUSTOM]
    box.style.top=nTop+1+oEl.offsetHeight;//[CUSTOM]

    this.isActive=true;
    
    this.refreshCustomColor();
    }
function hideColorPicker()
    {
    this.onHide();

    var box=document.getElementById("dropColor"+this.oRenderName);
    box.style.display="none";
    this.isActive=false;
    }
function hideColorPickerAll()
    {
    for(var i=0;i<arrColorPickerObjects.length;i++)
        {
        var box=document.getElementById("dropColor"+eval(arrColorPickerObjects[i]).oRenderName);
        box.style.display="none";
        eval(arrColorPickerObjects[i]).isActive=false;
        }
    }
    
function convertHexToDec(hex)
    {
    return parseInt(hex,16);
    }
    
function convertDecToHex(dec)
    {
    var tmp = parseInt(dec).toString(16);
    if(tmp.length == 1) tmp = ("0" +tmp);
    return tmp;//.toUpperCase();
    }
    
function convertDecToHex2(dec)
    {
    var tmp = parseInt(dec).toString(16);

    if(tmp.length == 1) tmp = ("00000" +tmp);
    if(tmp.length == 2) tmp = ("0000" +tmp);
    if(tmp.length == 3) tmp = ("000" +tmp);
    if(tmp.length == 4) tmp = ("00" +tmp);
    if(tmp.length == 5) tmp = ("0" +tmp);

    tmp = tmp.substr(4,1) + tmp.substr(5,1) + tmp.substr(2,1) + tmp.substr(3,1) + tmp.substr(0,1) + tmp.substr(1,1)
    return tmp;//.toUpperCase();
    }
    
//input color in format rgb(R,G,B)
//ex, return by document.queryCommandValue(forcolor)
function extractRGBColor(col) {
    var re = /rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/i;
    if (re.test(col)) {
        var result = re.exec(col);
        return convertDecToHex(parseInt(result[1])) + 
               convertDecToHex(parseInt(result[2])) + 
               convertDecToHex(parseInt(result[3]));
    }
    return convertDecToHex2(0);
}    
    