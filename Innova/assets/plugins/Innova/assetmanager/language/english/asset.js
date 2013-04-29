function getTxt(s)
	{
	switch(s)
		{
		case "Cannot delete Asset Base Folder.":return "Удаление основной папки невозможно.";
		case "Delete this file ?":return "Удалить этот файл ?";
		case "Uploading...":return "Загружаю...";
		case "File already exists. Do you want to replace it?":return "Такой файл уже есть. Заменить его новым?";
				
		case "Files": return "Файлы";
		case "del": return "удалить";
		case "Empty...": return "Пусто...";
		}
	}
function loadTxt()
	{
	var txtLang = document.getElementsByName("txtLang");
	txtLang[0].innerHTML = "Новая&nbsp;Папка";
	txtLang[1].innerHTML = "Удалить&nbsp;Папку";
	txtLang[2].innerHTML = "Загрузить файл";
	
	var optLang = document.getElementsByName("optLang");
    optLang[0].text = "Все файлы";
    optLang[1].text = "Медиа";
    optLang[2].text = "Картинки";
    optLang[3].text = "Флэш";
	
    document.getElementById("btnOk").value = " ok ";
    document.getElementById("btnUpload").value = "загрузить";
	}
function writeTitle()
    {
    document.write("<title>Файловый менеджер</title>")
    }