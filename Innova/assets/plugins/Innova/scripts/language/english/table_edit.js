function loadTxt()
    {
    var txtLang =  document.getElementsByName("txtLang");
    //txtLang[0].innerHTML = "Size";
    txtLang[0].innerHTML = "Автоподгонка";
    txtLang[1].innerHTML = "Свойства";
    txtLang[2].innerHTML = "Стиль";
    //txtLang[4].innerHTML = "Insert Row";
    //txtLang[5].innerHTML = "Insert Column";
    //txtLang[6].innerHTML = "Span/Split Row";
    //txtLang[7].innerHTML = "Span/Split Column";
    //txtLang[8].innerHTML = "Delete Row";
    //txtLang[9].innerHTML = "Delete Column";    
    txtLang[3].innerHTML = "Ширина";
    txtLang[4].innerHTML = "Размер по тексту";
    txtLang[5].innerHTML = "Фиксированная ширина";
    txtLang[6].innerHTML = "Уместить в окно";
    txtLang[7].innerHTML = "Высота";
    txtLang[8].innerHTML = "Размер по тексту";
    txtLang[9].innerHTML = "Фиксированная высота";
    txtLang[10].innerHTML = "Уместить в окно";
    txtLang[11].innerHTML = "Выравнивание";
    txtLang[12].innerHTML = "Отступ";
    txtLang[13].innerHTML = "Слева";
    txtLang[14].innerHTML = "Справа";
    txtLang[15].innerHTML = "Сверху";
    txtLang[16].innerHTML = "Снизу";
    txtLang[17].innerHTML = "Рамка";
    txtLang[18].innerHTML = "Collapse";
    txtLang[19].innerHTML = "Фон";
    txtLang[20].innerHTML = "Между ячейками";
    txtLang[21].innerHTML = "Отступ ячеек";
    txtLang[22].innerHTML = "Заголовок";
    txtLang[23].innerHTML = "тэг Summary";
    txtLang[24].innerHTML = "CSS Текст";
        
    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "пиксели"
    optLang[1].text = "проценты"
    optLang[2].text = "пиксели"
    optLang[3].text = "проценты"
    optLang[4].text = ""
    optLang[5].text = "Левый край"
    optLang[6].text = "Центр"
    optLang[7].text = "Правый край"
    optLang[8].text = "Нет рамки"
    optLang[9].text = "Да"
    optLang[10].text = "Нет"

    document.getElementById("btnPick").value="Выбрать";
    document.getElementById("btnImage").value="Картинка";

    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnApply").value = "применить";
    document.getElementById("btnOk").value = " ok ";
    }
function getTxt(s)
    {
    switch(s)
        {
        case "Cannot delete column.":
            return "Невозможно удалить столбец. Столбец содержит заполненные ячейки другого столбца. Удалите сначала зависимый столбец.";
        case "Cannot delete row.":
            return "Невозможно удалить строку. Строка содержит заполненные ячейки другой строки. Удалите сначала зависимую строку.";
        case "Custom Colors": return "Избранные цвета";
        case "More Colors...": return "Больше цветов...";
        default:return "";
        }
    }
function writeTitle()
    {
    document.write("<title>Свойства таблицы</title>")
    }