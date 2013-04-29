function getTxt(s)
	{
	switch(s)
		{
		case "Folder already exists.": return "Такая папка уже существует.";
		case "Folder created.": return "Папка создана.";
		case "Invalid input.": return "Неправльное имя папки.";
		}
	}
function loadTxt()
	{
    document.getElementById("txtLang").innerHTML = "Новое имя папки (лат. буквы)";
    document.getElementById("btnCloseAndRefresh").value = "закрыть & обновить";
    document.getElementById("btnCreate").value = "создать";
	}
function writeTitle()
	{
	document.write("<title>Создание папки</title>")
	}
