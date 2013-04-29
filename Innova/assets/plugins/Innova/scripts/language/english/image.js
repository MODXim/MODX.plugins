function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Источник";
    txtLang[1].innerHTML = "атрибут Title";
    txtLang[2].innerHTML = "Отступ";
    txtLang[3].innerHTML = "Выравнивание";
    txtLang[4].innerHTML = "Сверху";
    txtLang[5].innerHTML = "Рамка";
    txtLang[6].innerHTML = "Снизу";
    txtLang[7].innerHTML = "Ширина";
    txtLang[8].innerHTML = "Слева";
    txtLang[9].innerHTML = "Высота";
    txtLang[10].innerHTML = "Справа";
    
    var optLang = document.getElementsByName("optLang");
    optLang[0].text = "абс.снизу";
    optLang[1].text = "абс.середина";
    optLang[2].text = "по основанию";
    optLang[3].text = "по низу";
    optLang[4].text = "по левому краю";
    optLang[5].text = "по середине";
    optLang[6].text = "по правому краю";
    optLang[7].text = "по верхнему тексту";
    optLang[8].text = "по верхнему краю";
 
    document.getElementById("btnBorder").value = " Стиль рамки ";
    document.getElementById("btnReset").value = "стереть"
    
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnInsert").value = "вставить";
    document.getElementById("btnApply").value = "применить";
    document.getElementById("btnOk").value = " ok ";
    }
function writeTitle()
    {
    document.write("<title>Картинка</title>")
    }