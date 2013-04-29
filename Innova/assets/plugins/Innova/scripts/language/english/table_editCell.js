function loadTxt()
    {
    
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Автоподгонка";
    txtLang[1].innerHTML = "Свойства";
    txtLang[2].innerHTML = "Стиль";
    txtLang[3].innerHTML = "Ширина";
    txtLang[4].innerHTML = "Размер по тексту";
    txtLang[5].innerHTML = "Фиксированная ширина";
    txtLang[6].innerHTML = "Высота";
    txtLang[7].innerHTML = "Размер по тексту";
    txtLang[8].innerHTML = "Фиксированная высота";
    txtLang[9].innerHTML = "Выравнивание";
    txtLang[10].innerHTML = "Набивка";
    txtLang[11].innerHTML = "Слева";
    txtLang[12].innerHTML = "Справа";
    txtLang[13].innerHTML = "Сверху";
    txtLang[14].innerHTML = "Снизу";
    txtLang[15].innerHTML = "Пустые места";
    txtLang[16].innerHTML = "Фон";
    txtLang[17].innerHTML = "Пред. просмотр";
    txtLang[18].innerHTML = "CSS Текст";
    txtLang[19].innerHTML = "Применить к";

    document.getElementById("btnPick").value = "Выбрать";
    document.getElementById("btnImage").value = "Картинка";
    document.getElementById("btnText").value = " Форматирование текста ";
    document.getElementById("btnBorder").value = " Стиль рамки ";

    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnApply").value = "применить";
    document.getElementById("btnOk").value = " ok ";
    
    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "пиксели"
    optLang[1].text = "проценты"
    optLang[2].text = "пиксели"
    optLang[3].text = "проценты"
    optLang[4].text = "не выбрано"
    optLang[5].text = "кверху"
    optLang[6].text = "по середине"
    optLang[7].text = "книзу"
    optLang[8].text = "по основанию"
    optLang[9].text = "под"
    optLang[10].text = "над"
    optLang[11].text = "верх текста"
    optLang[12].text = "низ текста"
    optLang[13].text = "не выбрано"
    optLang[14].text = "влево"
    optLang[15].text = "по центру"
    optLang[16].text = "вправо"
    optLang[17].text = "по ширине"
    optLang[18].text = "Не выбрано"
    optLang[19].text = "Не переносить"
    optLang[20].text = "pre"
    optLang[21].text = "Обычный"
    optLang[22].text = "Текущей ячейке"
    optLang[23].text = "Текущей строке"
    optLang[24].text = "Текущему столбцу"
    optLang[25].text = "Всей таблице"
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
    document.write("<title>Свойства ячейки</title>")
    }