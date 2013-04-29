function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Путь к файлу";
    txtLang[1].innerHTML = "Ширина";
    txtLang[2].innerHTML = "Высота";
    txtLang[3].innerHTML = "Автостарт";
    txtLang[4].innerHTML = "Показывать управление";
    txtLang[5].innerHTML = "Показывать панель статуса";
    txtLang[6].innerHTML = "Показывать дисплей";
    txtLang[7].innerHTML = "Авто возврат";   

    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnInsert").value = "вставить";
    document.getElementById("btnApply").value = "применить";
    document.getElementById("btnOk").value = " ok ";
    }
function writeTitle()
    {
    document.write("<title>Медиа</title>")
    }
