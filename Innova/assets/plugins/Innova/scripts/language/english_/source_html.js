function loadTxt()
    {
    document.getElementById("txtLang").innerHTML = "Wrap Text";
    document.getElementById("btnCancel").value = "cancel";
    document.getElementById("btnApply").value = "apply";
    document.getElementById("btnOk").value = " ok ";
    }
function getTxt(s)
    {
    switch(s)
        {
        case "Search":return "Search";
        case "Cut":return "Cut";
        case "Copy":return "Copy";
        case "Paste":return "Paste";
        case "Undo":return "Undo";
        case "Redo":return "Redo";
        default:return "";
        }
    }
function writeTitle()
    {
    document.write("<title>Source Editor</title>")
    }
