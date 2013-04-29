function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Нумерованный";
    txtLang[1].innerHTML = "Ненумерованный";
    txtLang[2].innerHTML = "Начальное число";
    txtLang[3].innerHTML = "Отступ слева";
    txtLang[4].innerHTML = "Путь к картинке"
    txtLang[5].innerHTML = "Отступ слева";
    
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnApply").value = "применить";
    document.getElementById("btnOk").value = " ok ";   
    }
function getTxt(s)
    {
    switch(s)
        {
        case "Please select a list.":return "Выберите список.";
        default:return "";
        }
    }
function writeTitle()
    {
    document.write("<title>Форматирование списка</title>")
    }
