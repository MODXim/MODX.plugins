function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Type";
    txtLang[1].innerHTML = "Name";
    txtLang[2].innerHTML = "Size";
    txtLang[3].innerHTML = "Max Length";
    txtLang[4].innerHTML = "Num Line";
    txtLang[5].innerHTML = "Value";

    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "Text"
    optLang[1].text = "Textarea"
    optLang[2].text = "Password"
    
    document.getElementById("btnCancel").value = "cancel";
    document.getElementById("btnInsert").value = "insert";
    document.getElementById("btnApply").value = "apply";
    document.getElementById("btnOk").value = " ok ";
    }
function writeTitle()
    {
    document.write("<title>Text Field</title>")
    }