var express = require('express'),
	app = express();
var http = require('http').Server(app),
	io = require('socket.io')(http);
var path = require('path');
var cookieParser = require('cookie-parser'),
	session = require('express-session'),
	bodyParser = require('body-parser');
var users = [], server;

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static')));
app.use(cookieParser());
app.use(session({
	secret: 'COdinG_fOR_HaCKErrANK',
	saveUninitialized: true,
	resave: true
}));

function Editor(req, res) {
//	users.push(req.params.name);
//	res.render('editor', {
//		users: users
//	});
	res.send(req.body.user);
}

function HomePage(req, res) {
	res.render('index');
}

app.post('/editor', Editor);
app.get('/', HomePage);

function startServer() {
	http.listen(app.get('port'));
	console.log('Serving on PORT ' + app.get('port'));
	//for (var i=0;i<10;i++) {
		users.push("Ashutosh");
		users.push("Aditi");
		users.push("Sudha");
		users.push("Nisha");
	//}
}

io.on('connection', function(socket) {
	console.log("connected");
});

startServer();
