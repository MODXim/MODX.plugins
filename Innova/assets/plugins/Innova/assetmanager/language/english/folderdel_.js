function getTxt(s)
	{
    switch(s)
        {
		case "Folder deleted.": return "Папка удалена.";
		case "Folder does not exist.": return "Папка не существует.";
		case "Cannot delete Asset Base Folder.": return "Удаление основной папки невозможно.";
        }
    }
function loadTxt()
	{
	document.getElementById("btnCloseAndRefresh").value = "закрыть & обновить";
	}
function writeTitle()
	{
	document.write("<title>Удаление Папки</title>")
	}