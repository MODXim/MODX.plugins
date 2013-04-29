function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Type";
    txtLang[1].innerHTML = "Name";
    txtLang[2].innerHTML = "Value";

    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "Button"
    optLang[1].text = "Submit"
    optLang[2].text = "Reset"
        
    document.getElementById("btnCancel").value = "cancel";
    document.getElementById("btnInsert").value = "insert";
    document.getElementById("btnApply").value = "apply";
    document.getElementById("btnOk").value = " ok ";
    }
function writeTitle()
    {
    document.write("<title>Button</title>")
    }