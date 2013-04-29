var editor;


/**
 * language
 **/

if (uilang === "japanese-utf8") {
	uilang = {
		lang: "言語モード", 
		theme: "テーマ",
		fontsize: "フォントサイズ",
		full: "フルスクリーン(e)"
	};
} else {
	uilang = {
		lang: "Language", 
		theme: "Theme",
		fontsize: "FontSize",
		full: "Fullscreen(e)"
	};
}

/**
 * config
 **/
var conf = new (function() {
	this.set = function(name, value) {
		if (window.localStorage) {
			window.localStorage[name] = value;
		}
	};
	this.get = function(name, defaultValue) {
		if (window.localStorage && window.localStorage[name]) {
			return window.localStorage[name];
		}
		return defaultValue != undefined ? defaultValue : null;
	}
	
})();

/**
 * reference original textarea
 **/
var ta = document.getElementById("ta");
if (!ta) {
	ta = document.getElementsByName("post")[0];
	if (!ta) return;
}
if (ta.tagName != "TEXTAREA") return;

/**
 * hide original textarea
 **/
ta.style.position = "fixed";
ta.style.left = "-999em";
ta.style.width = ta.style.height = "100px";
ta.style.top = "0";


/**
 * embed ACE
 **/
var container = document.createElement("div");
container.className = "ace_plugin_container";
 
var outer = document.createElement("div");
outer.className = "ace_plugin_outer";

var inner = document.createElement("div");
inner.id = "ta_inner";
inner.className = "ace_plugin_inner";
inner.innerHTML = ta.value.split("    ").join("\t").split("<").join("&lt;").split(">").join("&gt;");

container.appendChild(outer);
outer.appendChild(inner);
if (ta.nextSibling) {
	ta.parentNode.insertBefore(container, ta.nextSibling);
} else {
	ta.parentNode.appendChild(container);
}
editor = ace.edit("ta_inner");


/**
 * build toolbar
 **/
var tb = document.createElement("div");
var anchor = document.createElement("a");
anchor.name = "ace";
tb.appendChild(anchor);

function label(label) {
	var span = document.createElement("span");
	span.innerHTML = label;
	return span;
}

//mode
var mode = document.createElement("select");
var modes = ["HTML", "PHP", "CSS", "JavaScript", "XML", "Text"];
mode.onchange = function() {
	var value = mode.options[mode.selectedIndex].value;
	conf.set("mode", value);
	editor.getSession().setMode("ace/mode/" + value);
	editor.getSession().modeName = value;
};
var modeDefaultValue = language;
for (var i = 0; i < modes.length; i ++) {
	var opt = document.createElement("option");
	var value = modes[i].toLowerCase();
	opt.setAttribute("value", value);
	opt.appendChild(document.createTextNode(modes[i]));
	if (modeDefaultValue == value) {
		opt.setAttribute("selected", "selected");
	}
	mode.appendChild(opt);
}
tb.appendChild(label(uilang.lang))
tb.appendChild(mode);
mode.onchange();


//theme
var theme = document.createElement("select");
var themes = {
	"Bright": [
		["ace/theme/chrome", "Chrome"],
		["ace/theme/clouds", "Clouds"],
		["ace/theme/crimson_editor", "Crimson Editor"],
		["ace/theme/dawn", "Dawn"],
		["ace/theme/dreamweaver", "Dreamweaver"],
		["ace/theme/eclipse", "Eclipse"],
		["ace/theme/github", "GitHub"],
		["ace/theme/solarized_light", "Solarized Light"],
		["ace/theme/textmate", "TextMate"],
		["ace/theme/tomorrow", "Tomorrow"]
	],
	"Dark": [
//		["ace/theme/ambiance", "Ambiance"],
		["ace/theme/clouds_midnight", "Clouds Midnight"],
		["ace/theme/cobalt", "Cobalt"],
		["ace/theme/idle_fingers", "idleFingers"],
//		["ace/theme/kr", "krTheme"],
		["ace/theme/merbivore", "Merbivore"],
		["ace/theme/merbivore_soft", "Merbivore Soft"],
		["ace/theme/mono_industrial", "Mono Industrial"],
		["ace/theme/monokai", "Monokai"],
		["ace/theme/pastel_on_dark", "Pastel on dark"],
		["ace/theme/solarized_dark", "Solarized Dark"],
		["ace/theme/twilight", "Twilight"],
		["ace/theme/tomorrow_night", "Tomorrow Night"],
		["ace/theme/tomorrow_night_blue", "Tomorrow Night Blue"],
		["ace/theme/tomorrow_night_bright", "Tomorrow Night Bright"],
		["ace/theme/tomorrow_night_eighties", "Tomorrow Night 80s"],
		["ace/theme/vibrant_ink", "Vibrant Ink"]
	]
};
theme.onchange = function() {
	var value = theme.options[theme.selectedIndex].value;
	conf.set("theme", value);
	editor.setTheme(value);
};
var themeDefaultValue = conf.get("theme", "ace/theme/github");
for (var j in themes) {
	var optgr = document.createElement("optgroup");
	optgr.setAttribute("label", j);
	for (var i = 0; i < themes[j].length; i ++) {
		var opt = document.createElement("option");
		opt.setAttribute("value", themes[j][i][0]);
		opt.appendChild(document.createTextNode(themes[j][i][1]));
		if (themeDefaultValue == themes[j][i][0]) {
			opt.setAttribute("selected", "selected");
		}
		optgr.appendChild(opt);
	}
	theme.appendChild(optgr);
}
theme.onchange();
tb.appendChild(label(uilang.theme))
tb.appendChild(theme);


//font size
var size = document.createElement("select");
var sizes = [11,12,13,14,15];
size.onchange = function() {
	var value = size.options[size.selectedIndex].value;
	outer.style.lineHeight = parseInt(value) + 2 + "px";
	conf.set("size", value);
	editor.setFontSize(value + "px");
};
var sizeDefaultValue = conf.get("size", 12);
for (var i = 0; i < sizes.length; i ++) {
	var opt = document.createElement("option");
	var value = sizes[i];
	opt.setAttribute("value", value);
	opt.appendChild(document.createTextNode(value + "px"));
	if (sizeDefaultValue == value) {
		opt.setAttribute("selected", "selected");
	}
	size.appendChild(opt);
}
size.onchange();
tb.appendChild(label(uilang.fontsize))
tb.appendChild(size);


//which editor
var we = document.getElementById("which_editor")
if (we) {
	var label = we.previousSibling;
	while (label) {
		if (label.tagName) break;
		label = label.previousSibling;
	}
	if (label) {
		tb.appendChild(label);
		tb.appendChild(we);
	}
}


//fullscreen
var full = document.createElement("input");
full.setAttribute("type", "checkbox");
full.checked = conf.get("fullscreen", false) == "1";
full.onchange = function() {
	if (full.checked) {
		conf.set("fullscreen", 1);
		container.className = "ace_plugin_container ace_plugin_fullscreen";
	} else {
		conf.set("fullscreen", 0);
		container.className = "ace_plugin_container";
	}
	editor.resize();
};
setTimeout(full.onchange, 50);
var fulllabel = document.createElement("label");
fulllabel.appendChild(full);
fulllabel.appendChild(document.createTextNode(uilang.full));
tb.appendChild(fulllabel);


tb.className = "ace_plugin_toolbar";
outer.parentNode.insertBefore(tb, outer);



/**
 * knob
 **/
(function() {
var height = parseInt(conf.get("height", 500));
var lastDiff;
var lastClassName;
outer.style.height = height + "px";
editor.resize();

function position(e) {
	if (e) {
		return e.pageY;
	} else {
		return event.y + document.body.scrollTop;
	}	 
}

function move(e) {
	var now = position(e);
	lastDiff = now - start;
	if (height + lastDiff < 200) {
		lastDiff = 200 - height;
	} else if (height + lastDiff > 1000) {
		lastDiff = 1000 - height;
	}
	knob.style.top = lastDiff + "px";
}

function end() {
	height = height + lastDiff;
	if (height < 200) height = 200;
	else if (height > 1000) height = 1000;
	if (isNaN(height)) height = 500;
	conf.set("height", height);
	outer.style.height = height + "px";
	editor.resize();
	knob.style.top = 0;
	document.body.className = lastClassName;
	window.removeEventListener("mousemove", move);
	window.removeEventListener("mouseup", end);
}

var knob = document.createElement("div");
var start;
knob.className = "ace_plugin_knob";
outer.parentNode.appendChild(knob);
knob.onmousedown = function(e) {
	lastClassName = document.body.className;
	document.body.className += " ace_plugin_drag";
	lastDiff = 0;
	start = position(e);
	window.addEventListener("mousemove", move);
	window.addEventListener("mouseup", end);
};

})();



/**
 * configure
 **/
var session = editor.getSession();
var selection = session.getSelection();

selection.moveCursorTo(parseInt(conf.get(id + "row", 0)), parseInt(conf.get(id + "col", 0)), false);
session.setScrollLeft(parseInt(conf.get(id + "scrollx", 0)));
session.setScrollTop(parseInt(conf.get(id + "scrolly", 0)));

editor.setShowPrintMargin(false);
session.setUseSoftTabs(false);
session.setUseWrapMode(true);

editor.on("blur", function(e) {
	ta.focus();
	ta.blur();
});
editor.on("change", function() {
	ta.value = editor.getValue();
	documentDirty = true;
});
session.on("changeScrollLeft", function() {
	conf.set(id + "scrollx", session.getScrollLeft());
});
session.on("changeScrollTop", function() {
	conf.set(id + "scrolly", session.getScrollTop());
});
selection.on("changeCursor", function() {
	var e = selection.getCursor();
	conf.set(id + "col", e.column);
	conf.set(id + "row", e.row);
});


/**
 * keybind
 **/
var HashHandler = require("ace/keyboard/hash_handler").HashHandler;
var handler = new HashHandler();
//Please extend this.
var commands = {
	s: function() {
		var node = container.parentNode;
		documentDirty = false;
		while(node) {
			if (node.tagName == "FORM") {
				node.action += "#ace";
				node.submit();
				break;
			}
			node = node.parentNode;
		}
	},
	e: function() {
		full.checked = !full.checked;
		full.onchange();
	}
};
handler.handleKeyboard = function(edi, hashId, key, keyCode) {
	if (hashId <= 0) return;
	var ctrl = hashId & 1 == 1;
//	var alt = (hashId >> 1) & 1 == 1;
//	var shift = (hashId >> 2) & 1 == 1;
	var cmd = (hashId >> 3) & 1 == 1;
	if (!ctrl && !cmd) return;
	if (!commands[key]) return;
	return {
		command: {
			exec: commands[key]
		}
	};
};
editor.setKeyboardHandler(handler);
