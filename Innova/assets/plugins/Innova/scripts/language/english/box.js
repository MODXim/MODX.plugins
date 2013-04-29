function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Цвет";
    txtLang[1].innerHTML = "Тень";
    
    txtLang[2].innerHTML = "Отступ";
    txtLang[3].innerHTML = "Слева";
    txtLang[4].innerHTML = "Справа";
    txtLang[5].innerHTML = "Сверху";
    txtLang[6].innerHTML = "Снизу";
    
    txtLang[7].innerHTML = "Набивка";
    txtLang[8].innerHTML = "Слева";
    txtLang[9].innerHTML = "Справа";
    txtLang[10].innerHTML = "Сверху";
    txtLang[11].innerHTML = "Снизу";
    
    txtLang[12].innerHTML = "Размеры";
    txtLang[13].innerHTML = "Ширина";
    txtLang[14].innerHTML = "Высота";
    
    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "пиксели";
    optLang[1].text = "проценты";
    optLang[2].text = "пиксели";
    optLang[3].text = "проценты";
    
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnApply").value = "применить";
    document.getElementById("btnOk").value = " ok ";
    }
function getTxt(s)
    {
    switch(s)
        {
        case "No Border": return "Нет рамки";
        case "Outside Border": return "Наружная рамка";
        case "Left Border": return "Левая рамка";
        case "Top Border": return "Верхняя рамка";
        case "Right Border": return "Правая рамка";
        case "Bottom Border": return "Нижняя рамка";
        case "Pick": return "Выбрать";
        case "Custom Colors": return "Свои цвета";
        case "More Colors...": return "Больше цветов...";
        default: return "";
        }
    }
function writeTitle()
    {
    document.write("<title>Форматирование ячейки</title>")
    }