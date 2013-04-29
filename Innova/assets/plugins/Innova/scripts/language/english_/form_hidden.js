function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Name";
    txtLang[1].innerHTML = "Value";
    
    document.getElementById("btnCancel").value = "cancel";
    document.getElementById("btnInsert").value = "insert";
    document.getElementById("btnApply").value = "apply";
    document.getElementById("btnOk").value = " ok ";
    }
function writeTitle()
    {
    document.write("<title>Hidden Field</title>")
    }
