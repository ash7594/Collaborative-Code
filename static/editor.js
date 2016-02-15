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
	//console.log(e.lines);
	if (e.action == "insert") {
		TransmitInsertion(
			e.lines[0],
			new Position(e.start.row, e.start.column),
			new Position(e.end.row, e.end.column)
		);
	}
});

