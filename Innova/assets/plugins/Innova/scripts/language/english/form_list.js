function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Name";
    txtLang[1].innerHTML = "Size";
    txtLang[2].innerHTML = "Multiple select";
    txtLang[3].innerHTML = "Values";
    
    document.getElementById("btnAdd").value = "  добавить  ";
    document.getElementById("btnUp").value = "  вверх  ";
    document.getElementById("btnDown").value = "  вниз  ";
    document.getElementById("btnDel").value = "  удалить  ";
    document.getElementById("btnCancel").value = "отмена";
    document.getElementById("btnInsert").value = "вставить";
    document.getElementById("btnApply").value = "применить";
    document.getElementById("btnOk").value = " ok ";
    }
function writeTitle()
    {
    document.write("<title>Список</title>")
    }