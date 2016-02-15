var socket = io();

socket.on('user_connect', function(user) {
	var div = document.createElement('div');
	div.id = user.uid;
	div.className = "participant";
	div.title = user.name;
	div.innerHTML = user.name.charAt(0).toUpperCase();
	document.getElementsByClassName('participants-container')[0].appendChild(div);
});

socket.on('user_disconnect', function(uid) {
	var div = document.getElementById(uid);
	div.parentNode.removeChild(div);
});

socket.on('insert', function(d) {
	var oldPosition = new Position(editor.selection.getCursor().row,
		editor.selection.getCursor().column);
	editor.selection.moveTo(d.start.r, d.start.c);
	editor.insert(d.data);
	editor.selection.moveTo(oldPosition.r, oldPosition.c);
});

function TransmitInsertion(data, start, end) {
	socket.emit('insert', { data: data, start: start, end: end });
}
