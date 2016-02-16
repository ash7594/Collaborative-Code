var editor;

function init() {
	editor = ace.edit("editor");
	editor.setFontSize(19);
	editor.setTheme('ace/theme/chrome');
	editor.setShowPrintMargin(false);
	editor.renderer.setShowGutter(false);
}

init();

var Position = function(r,c) {
	this.r = r;
	this.c = c;
};

editor.getSession().on('change', function(e) {
	if (!(editor.curOp && editor.curOp.command.name))
		return;
	console.log(e);
	if (e.action == "insert") {
		TransmitInsertion(e.lines[0], e.start, e.end);
	} else if (e.action == "remove") {
		TransmitDeletion(e.start, e.end);	
	}
});

