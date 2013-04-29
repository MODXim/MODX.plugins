function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Путь к файлу";
    txtLang[1].innerHTML = "Повторять";
    txtLang[2].innerHTML = "Горизонтальное<br> выравнивание";
    txtLang[3].innerHTML = "Вертикальное<br> выравнивание";

    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "Да, повторять"
    optLang[1].text = "Нет, не повторять"
    optLang[2].text = "Повторять горизонтально"
    optLang[3].text = "Повторять вертикально"
    optLang[4].text = "Влево"
    optLang[5].text = "Центр"
    optLang[6].text = "Вправо"
    optLang[7].text = "пиксели"
    optLang[8].text = "проценты"
    optLang[9].text = "Вверх"
    optLang[10].text = "Центр"
    optLang[11].text = "Вниз"
    optLang[12].text = "пиксели"
    optLang[13].text = "проценты"
    
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnOk").value = " ok ";
    }
function writeTitle()
    {
    document.write("<title>Фоновая картинка</title>")
    }

