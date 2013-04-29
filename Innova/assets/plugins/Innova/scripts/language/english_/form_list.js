function loadTxt()
    {
    var txtLang = document.getElementsByName("txtLang");
    txtLang[0].innerHTML = "Name";
    txtLang[1].innerHTML = "Size";
    txtLang[2].innerHTML = "Multiple select";
    txtLang[3].innerHTML = "Values";
    
    document.getElementById("btnAdd").value = "  add  ";
    document.getElementById("btnUp").value = "  up  ";
    document.getElementById("btnDown").value = "  down  ";
    document.getElementById("btnDel").value = "  del  ";
    document.getElementById("btnCancel").value = "cancel";
    document.getElementById("btnInsert").value = "insert";
    document.getElementById("btnApply").value = "apply";
    document.getElementById("btnOk").value = " ok ";
    }
function writeTitle()
    {
    document.write("<title>List</title>")
    }