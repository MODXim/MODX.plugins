var MultiGrid = new Class({
    initialize: function(fid,columnNames){
        this.fid = $(fid);
        this.columnNames = columnNames;
        var hpArr = (this.fid.value && this.fid.value != '[]') ? Json.evaluate(this.fid.value) : [null];
        this.fid.setStyle('display', 'none');
        /* headRows */
        var headRow = new Array();
        for (i=0; i<this.columnNames.length; i++) {
            headRow[i] = this.th(this.columnNames[i], (i == 0) ? 'first' : '');
        }
        this.box = new Element('table', {
            'class': 'gridEditor'
        }).adopt(this.tr(headRow.concat([
            this.th('', ''), this.th('', '')
        ])));

        this.fid.getParent().adopt(this.box);
        for (var i = 0; i < hpArr.length; i++) 
            this.addItem(hpArr[i]);
        this.sort = new Sortables(this.box, {
            onStart: function(el){
                el.setStyles({
                    'background': '#f0f0f0',
                    'opacity': 1
                });
            },
            onComplete: function(el){
                el.setStyle('background', 'none');
                this.setEditor();
            }.bind(this)
        });
        this.box.getElements('tr.griditem').setStyle('cursor', 'move');
        this.box.getElements('input[type=text]').addEvent('click', function(){
            this.focus();
        });
    },
    br: function(){
        return new Element('br');
    },
    table: function(elem, elClass){
        if (!elClass) elClass = '';
        return new Element('table').addClass(elClass).adopt(elem);
    },
    tr: function(elem, elClass){
        if (!elClass) elClass = '';
        return new Element('tr').addClass(elClass).adopt(elem);
    },
    th: function(text, elClass){
        if (!elClass) elClass = '';
        return new Element('th').addClass(elClass).setText(text);
    },
    td: function(elem, elClass){
        if (!elClass) elClass = '';
        return new Element('td').addClass(elClass).adopt(elem);
    },
    sp: function(text){
        return new Element('span').setText(text);
    },
    addItem: function(values, elem){
        var rowDiv = new Element('tr', {
            'class': 'griditem'
        });
        if (elem) {
            rowDiv.injectAfter(elem);
        }
        else {
            this.box.adopt(rowDiv);
        }
        
        /* values */
        if (!values) {
            var values = new Array();
            for (var i=0; i<this.columnNames.length; i++) {
                values[i] = '';
            }
        } else if (values.length < this.columnNames.length) {
            for (var i=values.length; i<this.columnNames.length; i++) {
                values[i] = '';
            }
        }
        /* bodyRows */
        var bodyRow = new Array();
        for (var i=0; i<this.columnNames.length; i++) {
            var grid = new Element('input', {
                'type': 'text',
                'class': 'gridVal',
                'value': values[i],
                'events': {
                    'keyup': function(){
                        this.setEditor();
                        documentDirty = true;
                    }.bind(this)
                }
            });
            bodyRow[i] = this.td(grid, (i == 0) ? 'first' : '');
        }

        var bAdd = new Element('input', {
            'type': 'button',
            'value': '+',
            'events': {
                'click': function(){
                    this.addItem(null, rowDiv);
                }.bind(this)
            }
        });
        var bRemove = new Element('input', {
            'type': 'button',
            'value': '-',
            'events': {
                'click': function(){
                    rowDiv.remove();
                    this.setEditor();
                }.bind(this)
            }
        });
        
        rowDiv.adopt(bodyRow.concat([
            this.td(bAdd)
        ]));
		if (this.box.getElements('tr.griditem').length > 1) {
        rowDiv.adopt(this.td(bRemove));
		} else {
		rowDiv.adopt(this.td(''));
		}
    },
    setEditor: function(){
        var hpArr = new Array();
        this.box.getElements('tr.griditem').each(function(item){
            var itemsArr = new Array();
            var inputs = item.getElements('input[type=text]');
            var noempty = false;
            inputs.each(function(item){
                itemsArr.push(item.value);
                if (item.value) 
                    noempty = true;
            });
            if (noempty) 
                hpArr.push(itemsArr);
        });
        this.fid.value = Json.toString(hpArr);
    }
});

window.addEvent('domready', function(){
    var tvids = [+tvids+];
    var columnNames = [+columnNames+];
    
    for (var i=0; i<tvids.length; i++) {
        if ($(tvids[i]) != null) {
            new MultiGrid(tvids[i], columnNames[i]);
        }
    }
});
