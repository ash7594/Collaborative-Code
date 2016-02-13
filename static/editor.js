var editor,
	session;

var socket = io();

function init() {
	editor = ace.edit("editor");
	editor.setFontSize(19);
	editor.setTheme('ace/theme/chrome');
	editor.setShowPrintMargin(false);
	editor.renderer.setShowGutter(false);
}

init();
