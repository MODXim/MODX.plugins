function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "CSS Текст";
    txtLang[1].innerHTML = "Class Name";
    
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnApply").value = "применить";
    document.getElementById("btnOk").value = " ok ";
    }
function getTxt(s)
    {
    switch(s)
        {
        case "You're selecting BODY element.":
            return "Вы выбрали элемент BODY.";
        case "Please select a text.":
            return "Выберите текст.";
        default:return "";
        }
    }
function writeTitle()
    {
    document.write("<title>Свои CSS</title>")
    }