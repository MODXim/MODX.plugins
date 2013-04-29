function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Путь к файлу";
    txtLang[1].innerHTML = "Фон";
    txtLang[2].innerHTML = "Ширина";
    txtLang[3].innerHTML = "Высота";
    txtLang[4].innerHTML = "Качество";
    txtLang[5].innerHTML = "Выравнивание";
    txtLang[6].innerHTML = "Повтор";
    txtLang[7].innerHTML = "Да";
    txtLang[8].innerHTML = "Нет";
    
    txtLang[9].innerHTML = "Class ID";
    txtLang[10].innerHTML = "CodeBase";
    txtLang[11].innerHTML = "PluginsPage";

    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "Низкое"
    optLang[1].text = "Высокое"
    optLang[2].text = "<не выбрано>"
    optLang[3].text = "Влево"
    optLang[4].text = "Вправо"
    optLang[5].text = "Кверху"
    optLang[6].text = "Книзу"
    
    document.getElementById("btnPick").value = "Выбрать";
    
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnOk").value = " ok ";
    }
function getTxt(s)
    {
    switch(s)
        {
        case "Custom Colors": return "Избранные цвета";
        case "More Colors...": return "Больше цветов...";
        default: return "";
        }
    }    
function writeTitle()
    {
    document.write("<title>Вставить флэш-ролик</title>")
    }