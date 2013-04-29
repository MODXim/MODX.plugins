function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Вэб-палитра";
    txtLang[1].innerHTML = "Именные цвета";
    txtLang[2].innerHTML = "216 безопасных";
    txtLang[3].innerHTML = "Новый";
    txtLang[4].innerHTML = "Текущий";
    txtLang[5].innerHTML = "Избранные цвета";

    document.getElementById("btnAddToCustom").value = "Добавить в избранные цвета";
    document.getElementById("btnCancel").value = " отмена ";
    document.getElementById("btnRemove").value = " удалить цвет ";
    document.getElementById("btnApply").value = " применить ";
    document.getElementById("btnOk").value = " ok ";
    }
function getTxt (s) 
    {
      switch (s) {
        case "Use Color Name": return "Имя цвета";
      }    
    }
function writeTitle()
    {
    document.write("<title>Цвета</title>")
    }
