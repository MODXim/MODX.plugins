function loadTxt()
    {
    document.getElementById("txtLang").innerHTML = "Переносить текст";
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnApply").value = "применить";
    document.getElementById("btnOk").value = " ok ";
    }
function getTxt(s)
    {
    switch(s)
        {
        case "Search":return "Поиск";
        case "Cut":return "Вырезать";
        case "Copy":return "Копировать";
        case "Paste":return "Вставить";
        case "Undo":return "Отменить";
        case "Redo":return "Вернуть";
        default:return "";
        }
    }
function writeTitle()
    {
    document.write("<title>Редактор кода</title>")
    }
