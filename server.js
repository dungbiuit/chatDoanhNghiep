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

	socket.on("client-send-sign-in", datareceive => {
		console.log("tên người dùng này là " + datareceive);
	});

	//	socket.on("client-send-sign-up", userreceive  => {
	//	console.log("username: " + userreceive.username);
	//	});

});
//Chat 
io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	// Disconnect
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s socket connected', connections.length)
	});
	// Send message
	socket.on('send message', function(data){
		console.log(data);
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});

	// New User
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames() {
		io.sockets.emit('get users', users);
	}

});
//Route đến trang chủ khi nhập localhost:3000
app.get("/", (request, respond) => {
	respond.render("inbox");
});
//Route đến trang đăng ký khi nhấn vào link đăng ký trong trang chủ
app.get("/trangdangky", (request,respond) => {
	respond.render("trangdangky");
});
app.post("/trangdangky", (request,respond) => {
	console.log(JSON.stringify(request.body));	
	//respond.redirect("/");

});
app.get("/post-sign-in", (request,respond) => {
	respond.render("post-sign-in");
});

