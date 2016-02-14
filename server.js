var express = require('express'),
	app = express();
var http = require('http').Server(app),
	io = require('socket.io')(http);
var path = require('path');
var cookieParser = require('cookie-parser'),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	sessionStore = new session.MemoryStore(),
	cookie = require('cookie');
var shortid = require('shortid');
var users = [], server;

const SESSION_SECRET = 'COdinG_fOR_HaCKErrANK';

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8000);

app.use(cookieParser());
app.use(session({
	store: sessionStore,
	secret: SESSION_SECRET,
	key: 'connect.ash',
	saveUninitialized: true,
	resave: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static')));

var userInfo = function(uid, name, sid) {
	this.uid = uid;
	this.name = name;
	this.sid = sid;
}

function Editor(req, res) {
	if (!req.body.user) {
		setImmediate(Page404,req,res);
		return;
	}
	var uid = shortid.generate();
	users.push({ uid: uid, name: req.body.user });
	req.session.username = req.body.user;
	req.session.uid = uid;

	res.render('editor', {
		users: users
	});
}

function HomePage(req, res) {
	res.render('index');
}

function Page404(req, res) {
	res.send("<h3>404 Not Found</h3>")
}

function HomeRedirect(req, res) {
	res.redirect('/');
}

app.post('/editor', Editor);
app.get('/editor', HomeRedirect);
app.get('/', HomePage);
app.get('*', Page404);

function startServer() {
	http.listen(app.get('port'));
	console.log('Serving on PORT ' + app.get('port'));
}

io.set('authorization', function(data, cback) {
	if (Object.keys(sessionStore.sessions).length == 0) {
		return cback('Unexpected', false);
	}
	if (data.headers.cookie) {
		data.cookie = cookie.parse(decodeURIComponent(data.headers.cookie));
		data.sessionID = cookieParser.signedCookie(
			data.cookie['connect.ash'],
			SESSION_SECRET
		);
	} else {
		return cback('Cookie Not Sent', false);
	}
	cback(null, true);
});

io.on('connection', function(socket) {
	console.log("connected");
	sessionStore.get(socket.request.sessionID, function(err, session) {
		if (err)
			throw err;
		socket.user = new userInfo(session.uid, session.username, session.id);
		socket.broadcast.emit('user_connect', { uid: socket.user.uid, name: socket.user.name })
	});

	socket.on('disconnect', function() {
		console.log("disconnected");
		io.emit('user_disconnect', socket.user.uid);
	});
});

startServer();
