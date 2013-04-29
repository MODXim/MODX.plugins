function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Name";
    txtLang[1].innerHTML = "Value";
    txtLang[2].innerHTML = "По умолчанию";

    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "Вкл."
    optLang[1].text = "Выкл."
    
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnInsert").value = "вставить";
    document.getElementById("btnApply").value = "применить";
    document.getElementById("btnOk").value = " ok ";
    }
function writeTitle()
    {
    document.write("<title>Чекбокс (Checkbox)</title>")
    }