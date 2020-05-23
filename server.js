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
let usernameTrangChu;
let mainUserArray = users.slice();
let usernameGetInboxPage;

//Chat 
io.sockets.on('connection', function(socket){
	connections.push(socket);
	
	console.log("có người log vào với id là  " + socket.id);
	console.log('Connected: %s sockets connected', connections.length);

	//Lấy username từ trangchu (xem trong public/source-control.js)
	socket.on("Client-send-sign-in", usernameReceive => {
		//tạo object với username từ trangchu.ejs và socketID là socket.id trangchu.ejs
		let userObject = {username:usernameReceive};
		checkUserObjectToAddArray(userObject, mainUserArray);
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
	usernameArray = mainUserArray.map(usernameOfEachUser => usernameOfEachUser.username);	
	console.log(usernameArray);

	function updateUsernames() {
		io.sockets.emit('get users', usernameArray);
	}

	//Kiểm tra xem username của userObject có tồn tại hay chưa, nếu chưa thì thêm vào mảng chính
	const checkUserObjectToAddArray = (userObjectToAdd, userArray) => {
		for(eachUsername of userArray){
			if(userObjectToAdd.username === userArray.username)
				return null;
		}
		userArray.push(userObjectToAdd);
	}
	//Server nhận được username và xóa trong mảng usernameArray 
	socket.on("Send username to remove", usernameSendFromClickingButton => {
		let indexOfUsername = usernameArray.indexOf(usernameSendFromClickingButton);
		usernameArray.splice(indexOfUsername, 1);
		updateUsernames();
		socket.emit("Alert user to exit", usernameSendFromClickingButton);
	});

							// **Vấn đề ở đây khi ở phần user không thể lấy socket.id ra so sánh 
	socket.on('send message', function(data){
		let cookief = socket.handshake.headers.cookie;

		let cookiesTest = cookie.parse(socket.handshake.headers.cookie);
		let userReceive = returnUsernameInUserArrayWhenSendMessageBySocketID(cookiesTest.username, mainUserArray);
		//log trong terminal xem username nhận được là gì -> nhưng hiện tại là undefined do socket.id truyền vào 
		//không trùng 
		console.log("Username hien tai la: " + userReceive);
		//Hàm này sẽ gửi đi message với msg chính là cái message mà nhập trong ô message và user chính là ng nhập
		io.sockets.emit('new message', {msg: data, user: userReceive});
		
	});

		//hàm sẽ trả về username nếu so sánh socketID trùng	
	const returnUsernameInUserArrayWhenSendMessageBySocketID = (usernameToCheck, userArray) => {
		for(eachUser of userArray){
			if(eachUser.username === usernameToCheck){
				return usernameToCheck;
			}
		}
	}
		console.log(mainUserArray);

});
//Route đến trang chủ khi nhập localhost:3000

// connect socket
app.get("/", (request,respond) => {
	respond.render("trangchu");
});

app.get("/inbox", (request,respond) => {

	usernameGetInboxPage = request.query.username;
	respond.cookie("username", usernameGetInboxPage );
	respond.render("inbox");
	
});

