function loadTxt()
    {
    var txtLang =  document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Строки";
    txtLang[1].innerHTML = "Между ячейками";
    txtLang[2].innerHTML = "Столбцы";
    txtLang[3].innerHTML = "Отступ";
    txtLang[4].innerHTML = "Рамка";
    txtLang[5].innerHTML = "Collapse";
    txtLang[6].innerHTML = "Заголовок";
    txtLang[7].innerHTML = "Summary";
    
  var optLang = document.getElementsByName("optLang");
    optLang[0].text = "Без рамки";
    optLang[1].text = "Да";
    optLang[2].text = "Нет";
    
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnInsert").value = "вставить";

    document.getElementById("btnSpan1").value = "Объединить v";
    document.getElementById("btnSpan2").value = "Объединить >";
    }
function writeTitle()
    {
    document.write("<title>Вставка таблицы</title>")
    }