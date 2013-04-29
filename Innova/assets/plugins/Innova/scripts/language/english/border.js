function loadTxt()
    {
    document.getElementById("txtLang").innerHTML = "Цвет";
    document.getElementById("btnCancel").value = "отмена";
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
	document.write("<title>Рамки</title>")
	}