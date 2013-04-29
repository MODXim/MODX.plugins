function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Source";
    txtLang[1].innerHTML = "Title";
    txtLang[2].innerHTML = "Spacing";
    txtLang[3].innerHTML = "Alignment";
    txtLang[4].innerHTML = "Top";
    txtLang[5].innerHTML = "Border";
    txtLang[6].innerHTML = "Bottom";
    txtLang[7].innerHTML = "Width";
    txtLang[8].innerHTML = "Left";
    txtLang[9].innerHTML = "Height";
    txtLang[10].innerHTML = "Right";
    
    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "absBottom";
    optLang[1].text = "absMiddle";
    optLang[2].text = "baseline";
    optLang[3].text = "bottom";
    optLang[4].text = "left";
    optLang[5].text = "middle";
    optLang[6].text = "right";
    optLang[7].text = "textTop";
    optLang[8].text = "top";
 
    document.getElementById("btnBorder").value = " Border Style ";
    document.getElementById("btnReset").value = "reset"
    
    document.getElementById("btnCancel").value = "cancel";
    document.getElementById("btnInsert").value = "insert";
    document.getElementById("btnApply").value = "apply";
    document.getElementById("btnOk").value = " ok ";
    }
function writeTitle()
    {
    document.write("<title>Image</title>")
    }