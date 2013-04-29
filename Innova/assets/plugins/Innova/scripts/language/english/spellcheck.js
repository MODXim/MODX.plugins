function loadTxt()
	{
	document.getElementById("btnCheckAgain").value = " Проверить еще раз ";
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnOk").value = " ok ";
	}
function getTxt(s)
	{
	switch(s)
		{
		case "Required":
			return "Необходим ieSpell (с сайта www.iespell.com).";
		default:return "";
		}
	}
function writeTitle()
	{
	document.write("<title>Проверка орфографии</title>")
	}