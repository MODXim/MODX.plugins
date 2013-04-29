/***********************************************************
    Copyright © 2007, InnovaStudio.com. All rights reserved.
************************************************************/

/***************************************************
    Utils:
    - getNumOfColumns
    - getCurrentRowLayout
    - getAbsoluteCellIndex
    - getNextRowLayout
****************************************************/

function getNextSibling(o) {
  if (!o) return null;
  var tmpO = o.nextSibling;
  while (true) {
    if (tmpO==null) return null;
    if (tmpO.nodeType==1 && (tmpO.tagName=="TD" || tmpO.tagName=="TR")) {
      return tmpO;
    }
    tmpO=tmpO.nextSibling;
  }
}

function getSpanNum(spn) {
    if (spn==null) return 1;
    return parseInt(spn);
}

function getNumOfColumns(oTable)
    {
    var numOfCols=0
    for (var i=0;i<oTable.rows.length;i++)  
        {
        var nCount=0
        var oTR_tmp=oTable.rows[i];
        for (var j=0;j<oTR_tmp.cells.length;j++) 
            {
            var oTD_tmp=oTR_tmp.cells[j];
            nCount+=getSpanNum(oTD_tmp.getAttribute("COLSPAN"))
            }
        if(nCount>numOfCols)numOfCols=nCount;
        //alert(numOfCols)
        }
    return numOfCols;
    }
    
function getCurrentRowLayout(oTable, oTR)
    {
    var numOfCols=getNumOfColumns(oTable);
    
    var sTmp="["
    for (var i=1;i<=numOfCols;i++)  sTmp+="false,";
    sTmp=sTmp.substr(0,sTmp.length-1)
    sTmp+="]"
    var arrAllCols = eval(sTmp)

    for(var i=0;i<oTR.rowIndex;i++)//tdk termasuk current row
        {
        var oTR_tmp=oTable.rows[i]
        //alert(oTR_tmp.outerHTML)
        var m=0
        for(var j=0;j<oTR_tmp.cells.length;j++)
            {
            var oTD_tmp=oTR_tmp.cells[j]
            var cSpan = getSpanNum(oTD_tmp.getAttribute("COLSPAN"));
            m+=cSpan;
            if(getSpanNum(oTD_tmp.getAttribute("ROWSPAN"))>=oTR.rowIndex+1-i)
                {
                for(var k=0;k<cSpan;k++)
                    {
                    arrAllCols[m-1+k]=true;
                    }
                }
            }
        }       
    return arrAllCols;
    }
    
function getAbsoluteCellIndex(oTable,oTR,oTD)//base 1
    {
    var arrAllCols=getCurrentRowLayout(oTable,oTR);
    
    var nCount=0;
    var bFinish=false
    for(var i=0;i<oTR.cells.length;i++)
        {
        if(bFinish==false)
            {
            nCount+=getSpanNum(oTR.cells[i].getAttribute("COLSPAN"));
            }
        if(oTD==oTR.cells[i])bFinish=true;
        }
    nCount=nCount-(getSpanNum(oTD.getAttribute("COLSPAN"))-1)
    //alert(nCount)
    for(var i=0;i<nCount;i++)
        {
        if(arrAllCols[i]==true)
            {//alert("OK")
            nCount++;
            }
        }
    var nCellIndex = nCount
    return nCellIndex;
    }
    
function getNextRowLayout(oTable,oTR,oTD)
    {
    var nCellIndex = getAbsoluteCellIndex(oTable,oTR,oTD);//base 1
    var numOfCols=getNumOfColumns(oTable);

    var sTmp="["
    for (i=1;i<=numOfCols;i++) sTmp+="false,";
    sTmp=sTmp.substr(0,sTmp.length-1)
    sTmp+="]"
    var arrTmp= eval(sTmp)

    var bFinish=false
    var oTR_tmp=oTR
    var rSpan = getSpanNum(oTD.getAttribute("ROWSPAN"));
    for(var k=0;k<rSpan;k++) oTR_tmp=getNextSibling(oTR_tmp);
    if(!oTR_tmp) return null
    //alert(oTR_tmp.outerHTML)

    //Navigate rows sblm TR3(target/next row) => TR0, TR1, TR2
    for (var i=0;i<oTR_tmp.rowIndex;i++) 
        {
        var oTR_before=oTable.rows[i]
        // alert(oTR_before.outerHTML)

        for (var j=0;j<oTR_before.cells.length;j++) 
            {
            var oTD_before=oTR_before.cells[j]; //alert(oTD_before.innerHTML)
            // alert(indx +", CONTENT: " + oTD_before.innerHTML)
                        
            /*  kalo TR1 cari rowSpan>=3
                kalo TR2 cari rowSpan>=2
                i+x=oTR_tmp.rowIndex krn base0 & next)
                0+x=3 x=3
                1+x=3 x=2   
                alert(oTD_before.rowSpan + " == " + (oTR_tmp.rowIndex+1-i))//+1 spy base1 krn jumlah*/
            if(getSpanNum(oTD_before.getAttribute("ROWSPAN"))>=oTR_tmp.rowIndex+1-i)
                {
                var cSpan = getSpanNum(oTD_before.getAttribute("COLSPAN"));
                for(k=0;k<cSpan;k++)
                    {
                    // alert("OK" + k)
                    var indx=getAbsoluteCellIndex(oTable,oTR_before,oTD_before)
                    arrTmp[indx-1+k]=true; //indx-1 krn base indx=1
                    }
                }
            }                   
        }
    return arrTmp;
    }

/***************************************************
    Span Row
****************************************************/
function spanRow()
    {
    var oEditor=parent.oUtil.oEditor;
    var oSel=oEditor.getSelection();
    var element = parent.getSelectedElement(oSel);
    
    var oTD = GetElement(element,"TD");
    if (oTD == null) return;
    var oTR = GetElement(element,"TR");
    if (oTR == null) return;
    var oTable = GetElement(element,"TABLE");
    if (oTable == null) return;
    
    var numOfCols=getNumOfColumns(oTable);
    
    var nCellIndex = getAbsoluteCellIndex(oTable,oTR,oTD);//base 1
    
    //Next Row
    oTR_tmp=oTR
    for(var k=0;k<oTD.rowSpan;k++) oTR_tmp=getNextSibling(oTR_tmp);
    if(!oTR_tmp) return false;
    //alert(oTR_tmp.outerHTML)
    
    var arrTmp = getNextRowLayout(oTable,oTR,oTD)
    //alert(arrTmp)

    //Cek arrTmp, jumlah true
    nCount=0
    for (i=0;i<nCellIndex;i++) if(arrTmp[i]==true)nCount++;
    numOfTrue=nCount
        
    nCount=numOfTrue
    iResult=0
    bFinish=false
    for (i=0;i<oTR_tmp.cells.length;i++)   
        {
        oTD_tmp=oTR_tmp.cells[i];
        var cSpan = getSpanNum(oTD_tmp.getAttribute("COLSPAN"));
        nCount+=cSpan;
        if(nCount>=nCellIndex && bFinish==false)
            {
            nCount=nCount-(cSpan-1)
            if(nCount==nCellIndex)
                {
                if(cSpan==getSpanNum(oTD.getAttribute("COLSPAN")))
                    {
                    nn=getSpanNum(oTD_tmp.getAttribute("ROWSPAN"));
                    //alert(oTD_tmp.innerHTML)
                    iResult=i
                    bFinish=true
                    }
                else return false;
                }
            else return false;
            }
        }
    //alert(iResult)

    nTmp=getSpanNum(oTD.getAttribute("ROWSPAN"));
    oTD.setAttribute("ROWSPAN",nTmp+nn); 
    oTR_tmp.deleteCell(iResult);
    return true;
    }   

/***************************************************
    Split Row
****************************************************/
function splitRow()
    {
    var oEditor=parent.oUtil.oEditor;
    var oSel=oEditor.getSelection();
    var element = parent.getSelectedElement(oSel);
    
    var oTD = GetElement(element,"TD");
    if (oTD == null) return;
    var oTR = GetElement(element,"TR");
    if (oTR == null) return;
    var oTable = GetElement(element,"TABLE");
    if (oTable == null) return;
    
    if(getSpanNum(oTD.getAttribute("ROWSPAN"))==1) return;//"TD tdk ada rowSpan
    
    var numOfCols=getNumOfColumns(oTable);
    
    var nCellIndex = getAbsoluteCellIndex(oTable,oTR,oTD);//base 1
    
    if(!getNextSibling(oTR))return;

    var arrTmp=getCurrentRowLayout(oTable, getNextSibling(oTR))
    //alert(arrTmp)
    //Cek arrTmp, jumlah true
    nCount=0
    for (i=0;i<nCellIndex;i++) if(arrTmp[i]==true)nCount++;
    numOfTrue=nCount

    nPoint=nCellIndex-numOfTrue//krn base=1
    //alert("nPoint= "+nPoint)
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    nCount=0
    iResult=0//
    oTR_tmp=getNextSibling(oTR);
    bFinish=false
    for (i=0;i<oTR_tmp.cells.length;i++)   
        {
        oTD_tmp=oTR_tmp.cells[i];
        var cSpan = getSpanNum(oTD_tmp.getAttribute("COLSPAN"));    
        nCount+=cSpan;

        //alert(nCount + "  " + oTD_tmp.innerHTML)
        if(nCount>nPoint && bFinish==false)
            {
            //alert("    OK")
            iResult=i
            bFinish=true
            }
        else if(bFinish==false)//kalau nCount belum mencapai >nPoint
            {
            //alert("    ambil index terakhir")
            iResult=i+1;
            }           
        }
    //alert(iResult)
        
    nTmp=getSpanNum(oTD.getAttribute("ROWSPAN"));
    oTD.setAttribute("ROWSPAN",1);  
    
    var oNewCell = oTR_tmp.insertCell(iResult);
    oNewCell.innerHTML = "New Cell";
    oNewCell.setAttribute("ROWSPAN", nTmp-1); 
    oNewCell.style.cssText = oTD_tmp.style.cssText;
    }

/***************************************************
    Span Column
****************************************************/
function spanCol()
    {
    var oEditor=parent.oUtil.oEditor;
    var oSel=oEditor.getSelection();
    var element = parent.getSelectedElement(oSel);
    
    var oTD = GetElement(element,"TD");
    if (oTD == null) return;
    var oTR = GetElement(element,"TR");
    if (oTR == null) return;
    var oTable = GetElement(element,"TABLE");
    if (oTable == null) return;
    
    if(getNextSibling(oTD))
        {
        if(getSpanNum(oTD.getAttribute("ROWSPAN"))==getSpanNum(getNextSibling(oTD).getAttribute("ROWSPAN")))
            {
            oTD.setAttribute("COLSPAN", getSpanNum(oTD.getAttribute("COLSPAN")) + getSpanNum(getNextSibling(oTD).getAttribute("COLSPAN")));
            //oTD.colSpan += oTD.nextSibling.colSpan;
            oTR.deleteCell(getNextSibling(oTD).cellIndex);
            }
        }
    }

/***************************************************
    Split Column
****************************************************/
function splitCol()
    {
    var oEditor=parent.oUtil.oEditor;
    var oSel=oEditor.getSelection();
    var element = parent.getSelectedElement(oSel);
    
    var oTD = GetElement(element,"TD");
    if (oTD == null) return;
    var oTR = GetElement(element,"TR");
    if (oTR == null) return;
    var oTable = GetElement(element,"TABLE");
    if (oTable == null) return;
    
    if(getSpanNum(oTD.getAttribute("COLSPAN"))==1)return;
    
    //~~~~ OLD ~~~~~~
    //if(!oTD.nextSibling)return;   
    //if(oTD.rowSpan!=oTD.nextSibling.rowSpan)return;
    //~~~~ OLD ~~~~~~

    //~~~~ NEW ~~~~~~
    if(getNextSibling(oTD))
        {
        if(getSpanNum(oTD.getAttribute("ROWSPAN"))!=getSpanNum(getNextSibling(oTD).getAttribute("ROWSPAN")))return;
        }
    //~~~~ NEW ~~~~~~

    //oTD.colSpan--;
    oTD.setAttribute("COLSPAN", getSpanNum(oTD.getAttribute("COLSPAN")) - 1);

    var oNewCell = oTR.insertCell(oTD.cellIndex+1);
    oNewCell.innerHTML = "New Cell";
    oNewCell.style.cssText = oTD.style.cssText;
    }

/************************
    SIZE
************************/
function doInsertRow(what)
    {
    if(what=="Above") 
        rowOperation(false,true,false,false);
    else
        rowOperation(false,false,true,false);
    }
function doInsertCol(what)
    {
    if(what=="Left") 
        colOperation(false,true,false,false);
    else
        colOperation(false,false,true,false);
    }   
function doDelRow()
    {
    rowOperation(false,false,false,true)
    }
function doDelCol()
    {
    colOperation(false,false,false,true)
    }
    

/***************************************************
    col & row Operation
****************************************************/
function colOperation(bGetArrayCells,bDoInsertColumnLeft,bDoInsertColumnRight,bDeleteColumn)
    {

    var oEditor=parent.oUtil.oEditor;
    var oSel=oEditor.getSelection();
    var element = parent.getSelectedElement(oSel);
    
    var oTD = GetElement(element,"TD");
    if (oTD == null) return;
    var oTR = GetElement(element,"TR");
    if (oTR == null) return;
    var oTable = GetElement(element,"TABLE");
    if (oTable == null) return;

    var bCannotDelete=false;
        
    sArrCols=""
    var nCellIndex = getAbsoluteCellIndex(oTable,oTR,oTD);//base 1
    nColSpan=getSpanNum(oTD.getAttribute("COLSPAN"));
        
    for (var i=0;i<oTable.rows.length;i++)  
        {
        var oTR_tmp = oTable.rows[i];
        arrTmp = getCurrentRowLayout(oTable,oTR_tmp)
        //alert(oTR_tmp.outerHTML)          
        
        if(arrTmp[nCellIndex-1]!=true)//Special case
            {               
            //Cek arrTmp, jumlah true
            nCount=0
            for (j=0;j<nCellIndex;j++) if(arrTmp[j]==true) nCount++;
            numOfTrue=nCount

            nCount=numOfTrue
            bFinish=false
            //alert(numOfTrue + "  " + arrTmp)
            for (k=0;k<oTR_tmp.cells.length;k++)   
                {                   
                oTD_tmp=oTR_tmp.cells[k];
                var cSpan = getSpanNum(oTD_tmp.getAttribute("COLSPAN"));
                nCount+=cSpan
                if(nCount>=nCellIndex && bFinish==false)
                    {                       
                    nCount=nCount-(cSpan-1)
                    //alert(nCellIndex + " OK  :  " + nCount + "   " +oTD_tmp.innerHTML)
                    if(nCount==nCellIndex)
                        {
                        //alert(oTD_tmp.innerHTML)  
                                                
                        //~~~~~~~~~~~~~~~~~~~~~~~~~~
                        if(bDoInsertColumnLeft || bDoInsertColumnRight) 
                            {
                            if(cSpan>1) 
                                {
                                //alert("colspan")  
                                oTD_tmp.setAttribute("COLSPAN",cSpan+1);
                                }
                            else
                                {
                                if(bDoInsertColumnLeft)
                                    {
                                    var oNewCell = oTR_tmp.insertCell(oTD_tmp.cellIndex);
                                    oNewCell.style.cssText=oTD_tmp.style.cssText;
                                    oNewCell.innerHTML = "New Cell";
                                            
                                    oNewCell.setAttribute("ROWSPAN", getSpanNum(oTD_tmp.getAttribute("ROWSPAN"))); 
                                    }
                                else
                                    {
                                    var oNewCell = oTR_tmp.insertCell(oTD_tmp.cellIndex+1);
                                    oNewCell.style.cssText=oTD_tmp.style.cssText;
                                    oNewCell.innerHTML = "New Cell";    
                                            
                                    oNewCell.setAttribute("ROWSPAN", getSpanNum(oTD_tmp.getAttribute("ROWSPAN"))); 
                                    }
                                }
                            }
                        //~~~~~~~~~~~~~~~~~~~~~~~~~~                            
                        
                        if(cSpan==nColSpan)
                            {
                            sArrCols += "[" + i + "," + oTD_tmp.cellIndex + "]," 
                            }
                        else
                            {
                            sArrCols += "[" + i + "," + oTD_tmp.cellIndex + "]," 
                            
                            if(bDeleteColumn)
                                {
                                alert(getTxt("Cannot delete column."));
                                return;
                                }                       
                            
                            }
                        }
                    else
                        {
                        //alert(oTD_tmp.innerHTML)
                        
                        //~~~~~~~~~~~~~~~~~~~~~~~~~~
                        if(bDoInsertColumnLeft || bDoInsertColumnRight) 
                            {
                            oTD_tmp.setAttribute("COLSPAN", cSpan+1);
                            }
                        //~~~~~~~~~~~~~~~~~~~~~~~~~~

                        if(bDeleteColumn)
                            {
                            alert(getTxt("Cannot delete column."));
                            return;
                            }
                        }
                    bFinish=true
                    }                   
                }
            }           
        }
    //alert(sArrCols.substring(0,sArrCols.length-1))
        
    var arrCols = eval("["+sArrCols.substring(0,sArrCols.length-1)+"]");
    
    if(bGetArrayCells)
        {
        return arrCols;
        }
    
    if(bDeleteColumn)
        {
        for (var i=0;i<arrCols.length;i++)  
            {
            var rowIndex=arrCols[i][0];
            var colIndex=arrCols[i][1];
            oTable.rows[rowIndex].deleteCell(colIndex);
            }
        var it=0;
        while(it < oTable.rows.length) {
          if(oTable.rows[it].cells.length==0) {
            oTable.deleteRow(it);
          } else it++;
        }
        if (oTable.rows.length==0) oTable.parentNode.removeChild(oTable);            
        }               
    parent.oUtil.obj.focus();        
    }

function rowOperation(bGetArrayCells,bDoInsertRowAbove,bDoInsertRowBelow,bDeleteRow)
    {
    var oEditor=parent.oUtil.oEditor;
    var oSel=oEditor.getSelection();
    var element = parent.getSelectedElement(oSel);
    
    var oTD = GetElement(element,"TD");
    if (oTD == null) return;
    var oTR = GetElement(element,"TR");
    if (oTR == null) return;
    var oTable = GetElement(element,"TABLE");
    if (oTable == null) return;
    
    if(bGetArrayCells)
        {
        var sTmp="[";
        for(var i=0;i<oTR.cells.length;i++)
            {
            sTmp += "[" + oTR.rowIndex + "," + oTR.cells[i].cellIndex + "],"
            }
        sTmp=sTmp.substr(0,sTmp.length-1) + "]"
        return eval(sTmp);  
        }
    
    var bCannotDelete=false;

    var numOfCols=getNumOfColumns(oTable);
    var sTmp="["
    for (var i=1;i<=numOfCols;i++)  sTmp+="[null,false],";
    sTmp=sTmp.substr(0,sTmp.length-1)
    sTmp+="]"
    var arrAllCols = eval(sTmp)

    //Cari yg rowSpannya mengenai current row
    for(var i=0;i<oTR.rowIndex;i++)//tdk termasuk current row
        {
        var oTR_tmp=oTable.rows[i]
        //alert(oTR_tmp.outerHTML)
        var m=0
        for(var j=0;j<oTR_tmp.cells.length;j++)
            {
            var oTD_tmp=oTR_tmp.cells[j]
            var cSpan = getSpanNum(oTD_tmp.getAttribute("COLSPAN"));
            m+=cSpan;
            if(getSpanNum(oTD_tmp.getAttribute("ROWSPAN"))>=oTR.rowIndex+1-i)
                {
                for(var k=0;k<cSpan;k++)
                    {
                    //arrAllCols[m-1+k]=true;
                    arrAllCols[m-1+k][0]=oTD_tmp;
                    arrAllCols[m-1+k][1]=true;
                    
                    if(bDeleteRow)
                        {
                        alert(getTxt("Cannot delete row."));
                        return;
                        }               
                    }
                }
            }
        }
        
    //Navigate current row
    nCount=0;
    for(var i=0;i<oTR.cells.length;i++)
        {
        var oTD_tmp=oTR.cells[i];
        var cSpan = getSpanNum(oTD_tmp.getAttribute("COLSPAN"));
        while(arrAllCols[nCount][0]!=null)  nCount++
        
        if(nCount<=numOfCols)
            {
            
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            if(bDoInsertRowAbove)
                {
                for(var j=0;j<cSpan;j++)
                    {
                    arrAllCols[nCount+j][0]=oTD_tmp;
                    arrAllCols[nCount+j][1]=false;              
                    }
                nCount=nCount+j;    
                }
            if(bDoInsertRowBelow)
                {
                if(getSpanNum(oTD_tmp.getAttribute("ROWSPAN"))>1)
                    {
                    for(var j=0;j<cSpan;j++)
                        {
                        arrAllCols[nCount+j][0]=oTD_tmp;
                        arrAllCols[nCount+j][1]=true;               
                        }               
                    }
                else
                    {
                    for(var j=0;j<cSpan;j++)
                        {
                        arrAllCols[nCount+j][0]=oTD_tmp;
                        arrAllCols[nCount+j][1]=false;              
                        }               
                    }           
                nCount=nCount+j;
                }
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            }
        }
        
        
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if(bDoInsertRowAbove)
        {
        var oNewRow = oTable.insertRow(oTR.rowIndex);
        }
    if(bDoInsertRowBelow)
        {
        var oNewRow = oTable.insertRow(oTR.rowIndex+1);
        }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~        
    //alert(arrAllCols)
    //Sampai di sini dapat arrAllCols, tapi blm ada pembedaan colSpan

    
    var oTD_Prev=null;
    for(var i=0;i<arrAllCols.length;i++)
        {
        var oTD_tmp=arrAllCols[i][0];
        
        if(oTD_tmp!=oTD_Prev)//ada pembedaan colSpan
            {           
            //alert(oTD_tmp.innerHTML)  
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            if(bDoInsertRowAbove || bDoInsertRowBelow)
                {
                if(arrAllCols[i][1]==true)
                    {
                    //alert("span")
                    oTD_tmp.setAttribute("ROWSPAN", getSpanNum(oTD_tmp.getAttribute("ROWSPAN")) + 1);
                    }
                else
                    {
                    oNewTD = oNewRow.insertCell(oNewRow.cells.length);
                    oNewTD.style.cssText=oTD_tmp.style.cssText;
                    oNewTD.innerHTML = "New Cell";
                    
                    oNewTD.setAttribute("COLSPAN", getSpanNum(oTD_tmp.getAttribute("COLSPAN")));
                    }
                }
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            }
        oTD_Prev=oTD_tmp;
        }
    

    if(bDeleteRow)
        {
        oTable.deleteRow(oTR.rowIndex);
        if (oTable.rows.length==0) oTable.parentNode.removeChild(oTable);
        }
        
    parent.oUtil.obj.focus();
    }