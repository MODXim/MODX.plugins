function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Путь";
    txtLang[1].innerHTML = "Закладка";
    txtLang[2].innerHTML = "Target";
    txtLang[3].innerHTML = "Текст";

    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "Self (это же окно/фрейм)"
    optLang[1].text = "Blank (новое окно)"
    optLang[2].text = "Parent (родительское окно)"
    
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnInsert").value = "вставить";
    document.getElementById("btnApply").value = "применить";
    document.getElementById("btnOk").value = " ok ";
    }
function writeTitle()
    {
    document.write("<title>Гиперссылка</title>")
    }