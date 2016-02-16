var editor;
var cursorDiv;

function init() {
	editor = ace.edit("editor");
	editor.setFontSize(19);
	editor.setTheme('ace/theme/chrome');
	editor.setShowPrintMargin(false);
	editor.renderer.setShowGutter(false);
	editor.getSession().setUseWrapMode(true);

	cursorDiv = document.getElementsByClassName('ace_cursor')[0];
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
		if (e.lines[0].length == 0) {
			TransmitInsertion('\n', e.start, e.end);
		} else {
			TransmitInsertion(e.lines[0], e.start, e.end);
		}
	} else if (e.action == "remove") {
		TransmitDeletion(e.start, e.end);
	}
});

editor.getSession().selection.on('changeCursor', function(e) {
	console.log("cursor");
	setTimeout(function() {
		TransmitCursor(new Position(cursorDiv.style.top, cursorDiv.style.left));
	}, 10);
});
