function loadTxt()
	{
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Поиск";
    txtLang[1].innerHTML = "Замена";
    txtLang[2].innerHTML = "С учетом регистра";
    txtLang[3].innerHTML = "Совпадает слово";
    
    document.getElementById("btnSearch").value = "искать далее";;
    document.getElementById("btnReplace").value = "заменить";
    document.getElementById("btnReplaceAll").value = "заменить все";
    document.getElementById("btnClose").value = "закрыть";
	}
function getTxt(s)
    {
    switch(s)
        {
        case "Finished searching": return "Поиск завершен.\n Искать снова сверху?";
        default: return "";
        }
    }  
function writeTitle()
	{
	document.write("<title>Поиск & Замена</title>")
	}