function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Выравнивание";
    txtLang[1].innerHTML = "Сдвиг";
    txtLang[2].innerHTML = "Отступ между словами";
    txtLang[3].innerHTML = "Межзнаковый интервал";
    txtLang[4].innerHTML = "Высота Строки";
    txtLang[5].innerHTML = "Ячейка текста";
    txtLang[6].innerHTML = "Незаполненное <br>пространство";
    
    document.getElementById("divPreview").innerHTML = "Lorem ipsum dolor sit amet, " +
        "consetetur sadipscing elitr, " +
        "sed diam nonumy eirmod tempor invidunt ut labore et " +
        "dolore magna aliquyam erat, " +
        "sed diam voluptua. At vero eos et accusam et justo " +
        "duo dolores et ea rebum. Stet clita kasd gubergren, " +
        "no sea takimata sanctus est Lorem ipsum dolor sit amet.";
    
    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "Не выбрано";
    optLang[1].text = "Левый край";
    optLang[2].text = "Правый край";
    optLang[3].text = "Центр";
    optLang[4].text = "По ширине";
    optLang[5].text = "Не выбрано";
    optLang[6].text = "ЗАГЛАВНЫЕ";
    optLang[7].text = "Верхний регистр";
    optLang[8].text = "Нижний регистр";
    optLang[9].text = "Как есть";
    optLang[10].text = "не выбрано";
    optLang[11].text = "Не переносить";
    optLang[12].text = "pre";
    optLang[13].text = "Normal";
    
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnApply").value = "применить";
    document.getElementById("btnOk").value = " ok ";   
    }
function writeTitle()
    {
    document.write("<title>Форматирование параграфа</title>")
    }
