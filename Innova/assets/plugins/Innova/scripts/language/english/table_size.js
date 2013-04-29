function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Вставить строку";
    txtLang[1].innerHTML = "Вставить столбец";
    txtLang[2].innerHTML = "Объединить <br> строки";
    txtLang[3].innerHTML = "Объединить <br> столбцы";
    txtLang[4].innerHTML = "Удалить строку";
    txtLang[5].innerHTML = "Удалить столбец";

	document.getElementById("btnInsRowAbove").title="Вставить строку (выше)";
	document.getElementById("btnInsRowBelow").title="Вставить строку (ниже)";
	document.getElementById("btnInsColLeft").title="Вставить столбец (слева)";
	document.getElementById("btnInsColRight").title="Вставить столбец (справа)";
	document.getElementById("btnIncRowSpan").title="Объеденить строки";
	document.getElementById("btnDecRowSpan").title="Разъеденить строки";
	document.getElementById("btnIncColSpan").title="Объеденить столбцы";
	document.getElementById("btnDecColSpan").title="Разъеденить столбцы";
	document.getElementById("btnDelRow").title="Удалить строку";
	document.getElementById("btnDelCol").title="Удалить столбец";
	document.getElementById("btnClose").value = " закрыть ";
    }
function getTxt(s)
    {
    switch(s)
        {
        case "Cannot delete column.":
            return "Невозможно удалить столбец. Столбец содержить йчейки другого столбца. Сначала удалите зависимый столбец.";
        case "Cannot delete row.":
            return "Невозможно удалить строку. Строка содержит ячейки другой строки. Сначала удалите зависимую строку.";
        default:return "";
        }
    }
function writeTitle()
    {
    document.write("<title>Ячейки таблицы</title>")
    }