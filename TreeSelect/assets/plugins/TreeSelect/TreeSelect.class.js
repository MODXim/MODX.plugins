// Part of the TreeSelectTV plugin version 0.2.1 for the MODx Evolution CMF

var TreeSelect = new Class({
    initialize: function(inputID,tree,inputStatus,basePath,saveConfig,config) {
        // get parameters
        this.id = inputID;
        this.name = 'tv' + this.id;
        this.input = $(this.name);
        this.table_col = this.input.getParent().getParent().getElements('td');
        this.options = config;
        this.filesOnly = (this.options['values']['list_files__only'] === true) || (this.options['values']['list_files__only'] == "yes") ? true : false;
        this.inputStatus = inputStatus == "hide" ? "" : inputStatus;
        this.imageView = this.options['values']['list_image_view'];
        this.hideOnSelect = this.options['values']['list_hideOnSelect'];
        this.basePath = basePath;
        this.saveConfig = (saveConfig == '') ? false : saveConfig;
        
        this.output = new Array();
        this.output[0] = this.input.value;
        this.setOutput();

        // hide main input field
        this.input.setStyle('display','none');

        if (this.saveConfig) {
            var opts = '';
            for (var i=1; i<this.saveConfig.length; i++) { opts += '<option>' + this.saveConfig[i] + '</option>' }
            this.save_box = new Element('div', { 'id':'treeBox_savebox_'+this.name, 'class':'treeBox_saveBox' });
            this.save_open_button = new Element('span', { 'class': 'button' });
            this.save_open_button.setHTML('CONFIG');
            this.filename = (this.saveConfig[0] == 'default') ? 'new file prefix:<br>'+this.name : 'existing file:<br>'+this.saveConfig[0];
            this.save_filename = new Element('span', { 'class': 'filename' });
            this.save_filename.setHTML(this.filename);

            this.save_content = new Element('div', { 'class':'treeBox_saveBoxContent hide' });
            this.save_option = new Element('select');
            this.save_option.setHTML(opts);
            this.save_check = new Element('input', { 'type':'checkbox', 'name':'save_check', 'value':'true' });
            this.save_box.adopt(this.save_open_button,this.save_content.adopt(this.save_filename,this.save_option,this.save_check));

            this.table_col[0].adopt(this.save_box);
            
            this.save_filename.set({
                'events': {
                    mouseover: function() { this.addClass('hover'); },
                    mouseleave: function() { this.removeClass('hover'); },
                    click: function() {
                        this.configBox();
                    }.bind(this)
                }
            });
            
            this.save_open_button.set({
                'events': {
                    mouseover: function() { this.addClass('hover'); },
                    mouseleave: function() { this.removeClass('hover'); },
                    click: function() {
                        if (!this.save_check.hasClass('checked')) {
                            this.save_box.toggleClass('open');
                            this.save_content.toggleClass('hide');
                        }
                    }.bind(this)
                }                
            });
            this.save_check.set({
                'events': {
                    mouseover: function() { this.addClass('hover'); },
                    mouseleave: function() { this.removeClass('hover'); },
                    click: function() {
                        this.save_check.toggleClass('checked');
                        this.setOutput();
                    }.bind(this)
                }
            });
            this.save_option.set({
                'events': {
                    mouseover: function() { this.addClass('hover'); },
                    mouseleave: function() { this.removeClass('hover'); },
                    change: function() {
                        this.set_save_check();
                        this.setOutput();
                    }.bind(this)
                }
            });
            
        }


        if (this.inputStatus != "") {
            // set new result field
            this.display = new Element('span', { 'id':'treeBoxOutput_'+this.name, 'class':'treeBox_output '+this.inputStatus });
            this.display.setHTML(this.output[0]);
            this.table_col[1].adopt(this.display);
        }
        // create new elements
        this.box = new Element('div',{'id':'treeBox_'+this.name,'class':'treeBox'});
        if ((this.imageView === true) || (this.imageView == "yes"))
            this.image = new Element('div',{'id':'treeBoxImage_'+this.name,'class':'treeBox_image'});
        // put HTML code
        this.box.setHTML(tree);
        
        // put input value to the tree
        this.selectors = this.box.getElements('.selector');
        this.togglers = this.box.getElements('.toggler');
        for (var i=0; i < this.selectors.length; i++) {
            var selector_line = this.selectors[i];
            while (!selector_line.hasClass('item_line')) selector_line = this.selectors[i].getParent();
            if (selector_line.getProperty('path') == this.output[0].replace(this.basePath, '')) {
                selector_line.addClass('new_select');
                // close selected node ...
                selector_line.addClass('close');
            }
        }
        // ... and open it again
        this.checkList();
        if (this.imageView) this.table_col[1].adopt(this.image);        
        // set event behavior for the button
        if (inputStatus == "toggle") {
            this.box.addClass('hide');
            this.display.set({
                'events': {
                    mouseover: function() { this.addClass('hover'); },
                    mouseleave: function() { this.removeClass('hover'); },
                    click: function() { this.box.toggleClass('hide'); }.bind(this)
                }                
            });
        }
        // set event behavior for items
        this.selectors.set({
            'events': {
                mouseover: function() { this.addClass('hover'); },
                mouseleave: function() { this.removeClass('hover'); },
                click: function() {
                    var selector_line = this;
                    while (!selector_line.hasClass('item_line')) selector_line = this.getParent();
                    if (!selector_line.hasClass('new_select')) selector_line.addClass('new_select');
                }
            }
        });
        // set event behavior for togglers
        this.togglers.set({
            'events': {
                mouseover: function() { this.addClass('hover'); },
                mouseleave: function() { this.removeClass('hover'); },
                click: function() {
                    var selector_line = this;
                    while (!selector_line.hasClass('item_line')) selector_line = this.getParent();
                    if (!selector_line.hasClass('new_toggle')) selector_line.addClass('new_toggle');
                }
            }
        });
        // set event bahavior for the box
        this.box.set({
            'events': {
                click: function() {
                    var new_select = this.box.getElements('.new_select');
                    if (new_select.length) { this.checkList(); }
                    var new_toggle = this.box.getElements('.new_toggle');
                    if (new_toggle.length) { this.toggleNode(); }
                }.bind(this)
            }
        });
        
        // add the new elements to the table cell
        this.table_col[1].adopt(this.box);
    },

    checkList: function() {
        var new_select = this.box.getElements('.new_select');
        if (new_select.length) {
            this.line = new_select[0];
            this.line.removeClass('new_select');

            // set value to input field
            if (this.line.hasClass('file') || (this.line.hasClass('folder') && !this.filesOnly)) {
                this.output[0] = this.basePath + this.line.getProperty('path');
                this.setOutput();
                if (this.inputStatus !== "") this.display.setHTML(this.output[0]);
                if ((this.inputStatus == "toggle") && ((this.hideOnSelect === true) || (this.hideOnSelect === "yes"))) this.box.toggleClass('hide');
            }
            if (this.imageView) {
                // show image preview
                var img = this.line.getProperty('img');
                if (img.length) this.image.setHTML('<img src="'+img+'">');
                else if (this.line.hasClass('file') || (this.filesOnly == false)) this.image.setHTML('');
            }

            // hide all other groups
            this.checkHideGroups();            

            // show all parents
            var parent = this.line;
            while (!parent.hasClass('level_1')) {
                if (parent.hasClass('hide')) parent.removeClass('hide');
                if (parent.hasClass('item_line') && !parent.hasClass('open')) parent.addClass('open');
                parent = parent.getParent();
            }
            
            // hide branch if already selected or marked to be closed
            if (this.line.hasClass('open') && (!this.line.hasClass('selected') || this.line.hasClass('close')))
                this.line.removeClass('open');
            else this.line.toggleClass('open');

            // select item
            this.box.getElements('.selected').removeClass('selected');
            this.line.addClass('selected');
                        
            this.toggleSubNodes();
            this.box.getElements('.close').removeClass('close');
            this.checkTogglers();
            
        } else this.checkHideGroups();
    },
    toggleNode: function() {
        // show or hide nodes
        var new_toggle = this.box.getElements('.new_toggle');
        
        if (new_toggle.length) {
            this.line = new_toggle[0];
            new_toggle.removeClass('new_toggle');
            if (this.line.hasClass('close')) this.line.removeClass('close');

            this.toggleSubNodes();
            this.checkTogglers();
            
        }
    },
    toggleSubNodes: function() {
        // show or hide subnodes
        if (!this.line.hasClass('last_item')) {
            if (!this.line.hasClass('close')) this.line.toggleClass('open');
            var child_group = this.line.getElements('.item_group');
            if ((child_group instanceof Array) && child_group.length) {
                if (this.line.hasClass('open') && child_group[0].hasClass('hide')) {
                    child_group[0].removeClass('hide');
                } else if (!this.line.hasClass('open') && !child_group[0].hasClass('hide')) {
                    child_group[0].addClass('hide');
                }
            }
        }
    },
    checkHideGroups: function() {
        var item_groups = this.box.getElements('.item_group');
        for (var i=0; i < item_groups.length; i++) {
            if (!item_groups[i].hasClass('hide') && !item_groups[i].hasClass('level_1')) item_groups[i].addClass('hide');
        }
    },
    checkTogglers: function() {
        // adjust togglers
        if (this.togglers.length) {
            for (var i=0; i < this.togglers.length; i++) {
                parent = this.togglers[i];
                while (!parent.hasClass('item_line')) parent = parent.getParent();
                var child_group = parent.getElements('.item_group');
                if (child_group.length) {
                    if (child_group[0].hasClass('hide')) {
                        if (this.togglers[i].hasClass('open')) this.togglers[i].removeClass('open');
                    } else {
                        if (!this.togglers[i].hasClass('open')) this.togglers[i].addClass('open');
                    }
                }
            }
        }
    },
    setOutput: function() {
        if (this.output[0] == null) this.output[0] = '';
        if (this.saveConfig && this.save_check && this.save_check.hasClass('checked')) {
            this.output[1] = this.name+':'+this.save_option.value;
            if (this.save_option.value == "delete") while (this.output.length > 2) this.output.pop()
            else this.output[2] = this.options['values'];
        } else while (this.output.length > 1) this.output.pop();
        this.input.value = Json.toString(this.output);
    },
    
    configBox: function() {
        var confBox = new Element('div').setProperties({
            'class': 'TreeSelectConfig'
        });
        
        var ConfigForm = '<ul>';
        for (var i in this.options['text']) {
            if (i == 'input_tvids') {
                this.options['values'][i] = this.id;
                continue;
            }
            ConfigForm += '<li><span class="text">'+this.options['text'][i]+'</span><span class="input">';
            if (this.options['options'][i]) {
                ConfigForm += '<select class="input '+this.options['type'][i]+'" name="'+i+'">';
                for (var o=0; o<this.options['options'][i].length; o++) {
                    ConfigForm += '<option'+(this.options['options'][i][o] == this.options['values'][i] ? ' selected' : '')+'>'+this.options['options'][i][o]+'</option>';
                }
                ConfigForm += '</select>';
            } else ConfigForm += '<input name="'+i+'" class="input '+this.options['type'][i]+'" type="text" value="'+this.options['values'][i]+'">';
            ConfigForm += '</span></li>';
        }
        ConfigForm += '</ul>';

        confBox.setHTML(ConfigForm);
        var boxHtml = new MooPrompt('TreeSelectTV - Configure '+this.filename.split("<br>").join(" "), confBox, {
            buttons: 2,
            button1: 'Ok',
            button2: 'Cancel',
            width: 500
        });

        // get form buttons
        var buttons = $$('.cbButtons input');
        // OK-Button
        buttons[0].set({
            'events': {
                click: function() {
                    this.set_save_check();
                    var inputs = $$('.input');
                    for (var i=0; i<inputs.length; i++) {
                        var opt = inputs[i].getProperty('name');
                        var val = inputs[i].value;
                        if (opt != null) this.options['values'][opt] = val;
                    }
                    this.setOutput();
                }.bind(this)
            }
        });
    },

    set_save_check: function() {
        if (!this.save_check.hasClass('checked')) {
            this.save_check.addClass('checked');
            this.save_check.setProperties({'checked': 'checked'});
        }
    }
});
