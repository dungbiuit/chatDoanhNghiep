let cookie = require('cookie');
let express = require("express");
let body_parser = require("body-parser");
let app = express();

let users = [];
let connections = [];

app.use(express.static("public"));
app.use(body_parser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");

let server = require("http").Server(app);
let io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

let usernameArray = [];  
let usernameGetInboxPage;

let isMuted = false;

//Chat 
io.sockets.on('connection', function(socket){
	connections.push(socket);

	console.log("có người log vào với id là  " + socket.id);
	console.log('Connected: %s sockets connected', connections.length);

	//Lấy username từ trangchu (xem trong public/source-control.js)
	socket.on("Client-send-sign-in", usernameReceive => {
		checkUsernameAddToArray(usernameReceive, usernameArray);
		socket.emit("Send username to inbox page", usernameReceive);
	})

	updateUsernames();

	// Disconnect socket
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.id), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s socket connected', connections.length)
	});

	//usernameArray sẽ chứa tất cả username có trong mảng tất cả user
	console.log(usernameArray);

	function updateUsernames() {
		io.sockets.emit('get users', usernameArray);
	}

	//Kiểm tra xem username của userObject có tồn tại hay chưa, nếu chưa thì thêm vào mảng chính
	const checkUsernameAddToArray = (usernameToAdd, usernameArray) => {
		for(eachUsername of usernameArray){
			if((usernameToAdd === eachUsername) || (usernameToAdd === "")) 
				return null;
		}
		usernameArray.push(usernameToAdd);
	}

	//Server nhận được username và xóa trong mảng usernameArray 
	socket.on("Send username to remove", usernameSendFromClickingButton => {
		let indexOfUsername = usernameArray.indexOf(usernameSendFromClickingButton);
		usernameArray.splice(indexOfUsername, 1);
		updateUsernames();
		socket.disconnect();
		io.sockets.emit("Alert user to exit", usernameSendFromClickingButton);
		isMuted = true;
	});

	// Khi gửi tin nhắn sẽ xem ten username trong  cookie
	socket.on('send message', function(data){
		let cookieGetFromInboxPage = socket.handshake.headers.cookie;
		let cookieInboxPage = cookie.parse(socket.handshake.headers.cookie);

		let userReceive = returnUsernameSortInUsernameArray(cookieInboxPage.username, usernameArray);
		console.log("Username hien tai la: " + userReceive);
		//Hàm này sẽ gửi đi message với msg chính là cái message mà nhập trong ô message và user chính là ng nhập
		//if(isMuted === true){
			//io.sockets.emit('new message', {msg: ""});

		//}else{
			//isMuted = false;
			io.sockets.emit('new message', {msg: data, user: userReceive});
		//}

	});

	//hàm sẽ trả về username nếu so sánh username trùng	
	const returnUsernameSortInUsernameArray = (usernameToCheck, usernameArray) => {
		for(eachUser of usernameArray){
			if(eachUser === usernameToCheck){
				return usernameToCheck;
			}
		}
		return null;
	}

});
//Route đến trang chủ khi nhập localhost:3000

app.get("/", (request,respond) => {
	respond.render("trangchu");
});

app.get("/inbox", (request,respond) => {
	usernameGetInboxPage = request.query.username;
	respond.cookie("username", usernameGetInboxPage );
	respond.render("inbox");
});

