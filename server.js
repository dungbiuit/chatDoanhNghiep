let express = require("express");
let body_parser = require("body-parser");
let app = express();

//
users=[];
connections=[];

app.use(express.static("public"));
app.use(body_parser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "./views");

let server = require("http").Server(app);
let io = require("socket.io")(server);
server.listen(3000);

io.on("connection", (socket) =>{
	console.log("có người log vào với id là  " + socket.id);


});
//Chat 
io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);
	
	// Disconnect
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.id), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s socket connected', connections.length)
	});
	
	// Send message
	socket.on('send message', function(data){
		
		io.sockets.emit('new message', {msg: data, user: socket.id});
	});

	// New User
	socket.on('new user', function(data, callback){
		callback(true);
	//	socket.username = data;
		users.push(socket.id);
		updateUsernames();
	});

	function updateUsernames() {
		io.sockets.emit('get users', users);
	}

});
//Route đến trang chủ khi nhập localhost:3000

app.get("/", (request,respond) => {
	respond.render("trangchu");
});

app.post("/", (request,respond) => {
	respond.redirect("inbox");
});

app.get("/inbox", (request,respond) => {
	respond.render("inbox");
});

app.get("/trangdangky", (request,respond) => {
	respond.render("trangdangky");
});

app.post("/trangdangky", (request,respond) => {
	console.log(JSON.stringify(request.body));	
});

app.get("/post-sign-in", (request,respond) => {
	respond.render("post-sign-in");
});


