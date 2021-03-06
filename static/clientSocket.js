var socket = io();
var cursor_ref;
var timer, lockLine = -1;

const LOCK_TIME = 5 * 1000;

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

socket.on('get_editor_content', function(cback) {
	cback(editor.getValue());
});

socket.on('set_editor_content', function(code) {
	editor.setValue(code, 1);
});

socket.on('user_disconnect', function(uid) {
	var div = document.getElementById(uid);
	div.parentNode.removeChild(div);

	div = document.getElementById(uid + "_cursor");
	div.parentNode.removeChild(div);

	div = document.getElementById(uid + "_cursor_helper");
	div.parentNode.removeChild(div);
});

socket.on('insert', function(d) {
	if (d.data == '\n') {
		editor.session.getDocument().insertNewLine(d.start);
	} else {
		editor.session.insert(d.start, d.data);
	}
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
	div2.style.top = (parseFloat(d.pos.r) + parseFloat(div2.style.height)) + "px";
	div2.style.left = d.pos.c;
});

function TransmitInsertion(data, start, end) {
	socket.emit('insert', { data: data, start: start, end: end });
}

function TransmitDeletion(start, end) {
	socket.emit('remove', { start: start, end: end });
}

function TransmitCursor(pos, line) {
	socket.emit('cursor', pos);
	if (lockLine != -1) {
		if (lockLine != line) {
			if (timer)
				clearTimeout(timer);
			resetLock();
		}
	}
}

function lockAquired(line) {
	console.log("token");
	editor.setReadOnly(false);
	lockLine = line;
	timer = setTimeout(resetLock, LOCK_TIME);
	//editor.session.insert(editor.getCursorPosition(), typed);
	//typed = "";
}

function resetLock() {
	console.log("lock reset");
	editor.setReadOnly(true);
	lockLine = -1;
}

function extendLock(line) {
	console.log("lock extended");
	clearTimeout(timer);
	timer = setTimeout(resetLock, LOCK_TIME);
	socket.emit('extend_lock', line);
}

function checkLineLock(line) {
	socket.emit('check_lock', line, function(is_locked) {
		if (!is_locked) {
			lockAquired(line);
		} else {
			typed = "";
			console.log("denied");
		}
	});
}
