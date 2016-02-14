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

function Editor(req, res) {
	console.log("editor");
	if (!req.body.user) {
		setImmediate(Page404,req,res);
		return;
	}
	users.push({
		name: req.body.user,
		session: req.session
	});
	req.session.username = req.body.user;

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
		console.log(err);
		if (err) {
			throw err;
		} else
			console.log(session.username);
	});
});

startServer();
