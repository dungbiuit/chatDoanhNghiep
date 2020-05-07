let cookieParser = require("cookie-parser");
let express = require("express");
let body_parser = require("body-parser");
let app = express();

//
let users = [];
let connections = [];

app.use(express.static("public"));
app.use(body_parser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", "./views");

let server = require("http").Server(app);
let io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

let usernameArray = [];  
let usernameTrangChu;
let mainUserArray = users.slice();
let socketIDOfUser;
// connect socket

//Chat 
io.sockets.on('connection', function(socket){
	connections.push(socket);
	
	console.log("có người log vào với id là  " + socket.id);
	console.log('Connected: %s sockets connected', connections.length);

	//Lấy username từ trangchu (xem trong public/source-control.js)
	socket.on("Client-send-sign-in", usernameReceive => {
		//tạo object với username từ trangchu.ejs và socketID là socket.id trangchu.ejs
		let userObject = {username:usernameReceive, socketID:socket.id,};
		checkUserObjectToAddArray(userObject, mainUserArray);

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

							// **Vấn đề ở đây khi ở phần user không thể lấy socket.id ra so sánh 
	socket.on('send message', function(data){
		let userReceive = returnUsernameInUserArrayWhenSendMessageBySocketID(socket.id, mainUserArray);
		//log trong terminal xem username nhận được là gì -> nhưng hiện tại là undefined do socket.id truyền vào 
		//không trùng 
		console.log(userReceive);
		//Hàm này sẽ gửi đi message với msg chính là cái message mà nhập trong ô message và user chính là ng nhập
		io.sockets.emit('new message', {msg: data, user: userReceive});
		
	});
		//hàm sẽ trả về username nếu so sánh socketID trùng	
	const returnUsernameInUserArrayWhenSendMessageBySocketID = (socketIDToCheck, userArray) => {
		for(eachUser of userArray){
			if(eachUser.socketID === socketIDToCheck){
				return eachUser.username;
			}
		}
	}
		console.log(mainUserArray);

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


