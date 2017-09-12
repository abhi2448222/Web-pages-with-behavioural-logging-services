var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var fs = require('fs');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use('/cssFiles', express.static(__dirname + '/public/stylesheets'));

app.get('/', routes.index);
app.get('/users', user.list);


app.listen(1338, function() {
	console.log("Server hit");
});

// Show Login Page
app.get('/', function(req, res) {
	res.render('indexPage', {ERRORMSG:''});
});

// Show Create Account page
app.get('/createAccount', function(req, res  ) {	
	res.render('createAccountPage');
});

// For Create Accounts checking
app.post('/createAccountCheck', function(req, res) {
	console.log(req.body.uname);
	console.log(req.body.pwd);
	var uName = req.body.uName;
	var pwd = req.body.pwd;
	var accCheckFlag = true;
	
	fs.readFileSync('./files/AccountsInformation.txt').toString().split('\n').forEach(
			function(line, index, arr) {
				if (index === arr.length - 1 && line === "") {
					return;
				}
				console.log(index + " " + line);
				var lines = line.split(";");
				var userName = lines[0];
				var passwrd = lines[1];
				if ((userName.toString().trim() === uName.toString().trim()) && (passwrd.toString().trim() === pwd.toString().trim())) {
					accCheckFlag=false;
				}

			});
	if(accCheckFlag === false){
		res.render('indexPage', {ERRORMSG:'UserName and Password combination already exists in the database. Please login with credentials'});
	}
	else{
		var dataWrite = fs.appendFileSync('./files/AccountsInformation.txt', uName + ';' + pwd + "\n", 'utf8');
		res.render('indexPage', {ERRORMSG:'Successfully created the account . Please login '});
	}
});

//capturing the LoginData
function loginDataCapture(userName){
	var loginData="";
	fs.readFileSync('./files/LoginHistory.txt').toString().split('\n').forEach(
			function(line, index, arr) {
				if (index === arr.length - 1 && line === "") {
					return;
				}
				console.log(index + " " + line);
				var lines = line.split(";");
				var userNameFromFile = lines[0];
				if(userNameFromFile.toString().trim()===userName.toString().trim()){
					loginData+=lines[1]+"\n";
				}
	});
	return loginData;
}

//capturing the Behavioual data
function behaviourDataCapture(userName){
	var behaviourData="";
	fs.readFileSync('./files/BehaviourHistory.txt').toString().split('\n').forEach(
			function(line, index, arr) {
				if (index === arr.length - 1 && line === "") {
					return;
				}
				console.log(index + " " + line);
				var lines = line.split(";");
				var userNameFromFile = lines[0];
				if(userNameFromFile.toString().trim()===userName.toString().trim()){
					behaviourData+=lines[1]+"\n";
				}
	});
	return behaviourData;
}

// For Login checking
app.post('/loginCheck', function(req, res) {

	var loginUName = req.body.uName;
	var loginPwd = req.body.pwd;
	var flag = false;

	fs.readFileSync('./files/AccountsInformation.txt').toString().split('\n').forEach(
					function(line, index, arr) {
						if (index === arr.length - 1 && line === "") {
							return;
						}
						console.log(index + " " + line);
						var lines = line.split(";");
						var userName = lines[0];
						var passwrd = lines[1];		
						if ((userName.toString().trim() === loginUName.toString().trim()) && (passwrd.toString().trim() === loginPwd.toString().trim())) {
							flag=true;
							
							//Add login time 
							var dateTime = require('node-datetime');
							var dt = dateTime.create();
							var formattedDateTime = dt.format('Y-m-d H:M:S');
							var dataWrite = fs.appendFileSync('./files/LoginHistory.txt', userName +" ; "+"Logged in : "+ formattedDateTime + "\n", 'utf8');
							
							//capture Login and behaviour data
							var loginHistory=loginDataCapture(userName);
							var behaviourHistory=behaviourDataCapture(userName);
							res.render('homePage',{USERNAME:userName, LOGINHISTORY :loginHistory, BEHAVIOURHISTORY :behaviourHistory});
						}

					});
	if(flag === false){
		console.log('Not found');
		res.render('indexPage',{ERRORMSG:'UserName and Password combination does not exist in the database. Please Try again'});
	}

});

//Handle Logout scenerio
app.post('/handleLogout', function(req, res) {
	var loginUName = req.body.userName;
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	var formattedDateTime = dt.format('Y-m-d H:M:S');
	var dataWrite = fs.appendFileSync('./files/LoginHistory.txt', loginUName +" ; "+"Logged out : "+ formattedDateTime + "\n", 'utf8');
	res.render('indexPage', {ERRORMSG:''});
});

//Behavioural logs captured from chromePlugin
app.post('/handleBehaviouralData', function(req, res) {
	var data=req.body.behaviouralLog;
	console.log('data got '+data);
	var dataWrite = fs.appendFileSync('./files/BehaviourHistory.txt',data+ "\n", 'utf8');
});


