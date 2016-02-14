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
