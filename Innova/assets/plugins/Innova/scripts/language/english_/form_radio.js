function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Name";
    txtLang[1].innerHTML = "Value";
    txtLang[2].innerHTML = "Default";

    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "Checked"
    optLang[1].text = "Unchecked"
    
    document.getElementById("btnCancel").value = "cancel";
    document.getElementById("btnInsert").value = "insert";
    document.getElementById("btnApply").value = "apply";
    document.getElementById("btnOk").value = " ok ";
    }
function writeTitle()
    {
    document.write("<title>Radio Button</title>")
    }