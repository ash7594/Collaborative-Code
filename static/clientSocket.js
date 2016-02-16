var socket = io();
var cursor_ref;

socket.on('user_connect', function(user) {
	cursor_ref = document.getElementsByClassName("ace_cursor")[0];
	var div = document.createElement('div');
	div.id = user.uid;
	div.className = "participant";
	div.title = user.name;
	div.innerHTML = user.name.charAt(0).toUpperCase();
	document.getElementsByClassName('participants-container')[0].appendChild(div);
});

function createCursorDiv(uid) {
	cursor_ref = document.getElementsByClassName("ace_cursor")[0];

	var div = document.createElement('div');
    div.id = uid + "_cursor";
    div.className = "fixed_cursor";
    div.style.height = cursor_ref.style.height;
    document.getElementById('editor').appendChild(div);

	div = document.createElement('span');
	div.id = uid + "_cursor_helper";
	div.className = "fixed_cursor_helper";
	div.style.height = cursor_ref.style.height;
	div.innerHTML = document.getElementById(uid).title;
	document.getElementById('editor').appendChild(div);
}

socket.on('user_disconnect', function(uid) {
	var div = document.getElementById(uid);
	div.parentNode.removeChild(div);
});

socket.on('insert', function(d) {
	editor.session.insert(d.start, d.data);
});

socket.on('remove', function(d) {
	editor.session.remove({ start: d.start, end: d.end });
});

socket.on('cursor', function(d) {
	var div = document.getElementById(d.uid + '_cursor'),
		div2 = document.getElementById(d.uid + '_cursor_helper');
	if (!div) {
		createCursorDiv(d.uid);
		div = document.getElementById(d.uid + '_cursor');
		div2 = document.getElementById(d.uid + '_cursor_helper');
	}
	div.style.top = d.pos.r;
	div.style.left = d.pos.c;
	div2.style.top = d.pos.r;
	div2.style.left = d.pos.c;
});

function TransmitInsertion(data, start, end) {
	socket.emit('insert', { data: data, start: start, end: end });
}

function TransmitDeletion(start, end) {
	socket.emit('remove', { start: start, end: end });
}

function TransmitCursor(pos) {
	socket.emit('cursor', pos);
}
