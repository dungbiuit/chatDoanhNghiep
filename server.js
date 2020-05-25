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

let cookieObjectArray = [];
let usernameArray = [];  
let usernameGetInboxPage;
//Chat 
io.sockets.on('connection', function(socket){
	connections.push(socket);

	console.log("có người log vào với id là  " + socket.id);
	console.log('Connected: %s sockets connected', connections.length);

	let cookieGetFromInboxPage = socket.handshake.headers.cookie;
	let cookieInboxPage = cookie.parse(socket.handshake.headers.cookie);

	//Hàm này sẽ cho biết socketID ở tab hiện tại đang mở 
	//Kiểm tra bằng cách nhấn F12 trong trình duyệt -> Application -> Cookies ->localhost -> Biến io chính là socketIDOfCurrentTab 
	//TODO Ý tưởng: lưu 2 thuộc tính socketID và username thành 1 object và cho vào 1 mảng cookieObjectArray[] (*), 
	socket.on("Send socketID of current tab", (socketIDOfCurrentTab) => {
	cookieObjectArray.push({SocketIOCookie : socketIDOfCurrentTab, UsernameCookie : cookieInboxPage.username});
	arrayTest = cookieObjectArray.slice(0);

	});

	console.log("cookie Array la: ", arrayTest);
	//Lấy username từ trangchu (xem trong public/source-control.js)
	socket.on("Client-send-sign-in", usernameReceive => {
		checkUsernameAddToArray(usernameReceive, usernameArray);
		socket.emit("Send username to inbox page", usernameReceive);
	});

	updateUsernames();
	//(*) Sau đó trong disconnect này sẽ trả về 1 socket.id của tab đã đóng -> Lấy socket ID đó so sánh với mảng bên trên để trả về username (**)
	// Disconnect socket
	socket.on('disconnect', function(){
		users.splice(users.indexOf(socket.id), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s socket connected', connections.length)
	});

	//usernameArray sẽ chứa tất cả username có trong mảng tất cả user
	//(**) Sau đó loại bỏ username đó khỏi usernameArray bằng hàm splice()
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

	// Khi gửi tin nhắn sẽ xem ten username trongcookie
	socket.on('send message', function(data){
		let cookieGetFromInboxPage = socket.handshake.headers.cookie;
		let cookieInboxPage = cookie.parse(socket.handshake.headers.cookie);

		let userReceive = returnUsernameSortInUsernameArray(cookieInboxPage.username, usernameArray);
		console.log("Username hien tai la: " + userReceive);
		//Hàm này sẽ gửi đi message với msg chính là cái message mà nhập trong ô message và user chính là ng nhập
			io.sockets.emit('new message', {msg: data, user: userReceive});
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
	respond.cookie("username", usernameGetInboxPage);
	respond.render("inbox");
});

