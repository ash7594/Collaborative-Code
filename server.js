var express = require('express'),
	app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8000);

app.use(express.static(path.join(__dirname, 'static')));
app.use(cookieParser());
app.use(session({
	secret: 'COdinG_fOR_HaCKErrANK',
	saveUninitialized: true,
	resave: true
}));

function homePage(req, res) {
	res.render('editor');
}

app.get('/', homePage);

function startServer() {
	app.listen(app.get('port'));
	console.log('Serving on PORT ' + app.get('port'));
}

startServer();
