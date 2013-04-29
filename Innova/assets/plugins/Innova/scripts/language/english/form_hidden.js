function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Name";
    txtLang[1].innerHTML = "Value";
    
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnInsert").value = "вставить";
    document.getElementById("btnApply").value = "применить";
    document.getElementById("btnOk").value = " ok ";
    }
function writeTitle()
    {
    document.write("<title>Скрытое поле</title>")
    }
