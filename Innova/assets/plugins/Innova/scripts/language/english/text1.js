var sStyleWeight1;
var sStyleWeight2;
var sStyleWeight3;
var sStyleWeight4; 

function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Шрифт";
    txtLang[1].innerHTML = "Стиль";
    txtLang[2].innerHTML = "Размер";
    txtLang[3].innerHTML = "Цвет текста";
    txtLang[4].innerHTML = "Цвет фона";
    
    txtLang[5].innerHTML = "Вид текста";
    txtLang[6].innerHTML = "Регистр текста";
    txtLang[7].innerHTML = "Minicaps";
    txtLang[8].innerHTML = "Вертикальное";

    txtLang[9].innerHTML = "Не выбрано";
    txtLang[10].innerHTML = "Underline";
    txtLang[11].innerHTML = "Overline";
    txtLang[12].innerHTML = "Line-through";
    txtLang[13].innerHTML = "None";

    txtLang[14].innerHTML = "Не выбрано";
    txtLang[15].innerHTML = "Capitalize";
    txtLang[16].innerHTML = "Uppercase";
    txtLang[17].innerHTML = "Lowercase";
    txtLang[18].innerHTML = "None";

    txtLang[19].innerHTML = "Не выбрано";
    txtLang[20].innerHTML = "Small-Caps";
    txtLang[21].innerHTML = "Normal";

    txtLang[22].innerHTML = "Не выбрано";
    txtLang[23].innerHTML = "Superscript";
    txtLang[24].innerHTML = "Subscript";
    txtLang[25].innerHTML = "Relative";
    txtLang[26].innerHTML = "Baseline";
    
    txtLang[27].innerHTML = "Отступ между буквами";

    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "Regular"
    optLang[1].text = "Italic"
    optLang[2].text = "Bold"
    optLang[3].text = "Bold Italic"
    
    optLang[0].value = "Regular"
    optLang[1].value = "Italic"
    optLang[2].value = "Bold"
    optLang[3].value = "Bold Italic"
    
    sStyleWeight1 = "Regular"
    sStyleWeight2 = "Italic"
    sStyleWeight3 = "Bold"
    sStyleWeight4 = "Bold Italic"
    
    optLang[4].text = "Кверху"
    optLang[5].text = "По середине"
    optLang[6].text = "Книзу"
    optLang[7].text = "Верх. текст"
    optLang[8].text = "Ниж. текст"
    
    document.getElementById("btnPick1").value = "Выбрать";
    document.getElementById("btnPick2").value = "Выбрать";

    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnApply").value = "применить";
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
    document.write("<title>Форматирование текста</title>")
    }