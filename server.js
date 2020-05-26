let cookie = require('cookie');
let express = require("express");
let body_parser = require("body-parser");
let app = express();

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
let usernameArrayToDelete = [];

//Các hàm chức năng 

const returnUsernameInArrayWhenComparingSocketIDTabClose = (cookieArray, socketIDTabClose) => {
	for(eachObject of cookieArray) {
		if(eachObject.SocketIOCookie === socketIDTabClose)
			return eachObject.UsernameCookie;
	}
	return null;
}

const addUsernameToUsernameArrayToDelete = (usernameToAdd, UsernameArrayToDelete) => {
	if(usernameToAdd !== null)
		UsernameArrayToDelete.push(usernameToAdd);
}

const checkUsernameExistInArrayToDelete = (arrayToCheck, usernameToCheck) => {
	for(eachUsername of arrayToCheck){
		if(usernameToCheck === eachUsername)
			return true;
	}
	return false;
}

function updateUsernames() {
	io.sockets.emit('get users', usernameArray);
}

//hàm sẽ trả về username nếu so sánh username trùng	
const returnUsernameSortInUsernameArray = (usernameToCheck, usernameArray) => {
	for(eachUser of usernameArray){
		if(eachUser === usernameToCheck){
			return usernameToCheck;
		}
	}
	return null;
}

const isUsernameValidToAddToArray = (usernameToAdd, usernameArray) => {
	for(eachUsername of usernameArray){
		if((usernameToAdd === eachUsername) || (usernameToAdd === "")) 
			return false;
	}
	return true;
}

const addUsernameToArray = (usernameToAdd, usernameArray) => {
	usernameArray.push(usernameToAdd);
}

//Chat 
io.sockets.on('connection', function(socket){
	connections.push(socket);

	console.log("có người log vào với id là  " + socket.id);
	console.log('Connected: %s sockets connected', connections.length);
	
	//Lấy username từ trangchu (xem trong public/source-control.js)
	socket.on("Client-send-sign-in", usernameReceive => {
			addUsernameToArray(usernameReceive, usernameArray);
		
	});

	//Hàm này sẽ cho biết socketID ở tab hiện tại đang mở 
	//Kiểm tra bằng cách nhấn F12 trong trình duyệt -> Application -> Cookies ->localhost -> Biến io chính là socketIDOfCurrentTab 
	//Ý tưởng: lưu 2 thuộc tính socketID và username thành 1 object và cho vào 1 mảng cookieObjectArray[] (*), 
	socket.on("Send socketID of current tab", (socketIDOfCurrentTab) => {
		let cookieGetFromInboxPage = socket.handshake.headers.cookie;
		let cookieInboxPage = cookie.parse(socket.handshake.headers.cookie);
		cookieObjectArray.push({SocketIOCookie:socketIDOfCurrentTab, UsernameCookie:cookieInboxPage.username});


		//Khi refresh lại trang thì kiểm tra username trong cookie lại để thêm vào k bị mất
		if((usernameArray.includes(cookieInboxPage.username) === false)){
			usernameArray.push(cookieInboxPage.username);
		}
		updateUsernames();
	});

	//(*) Sau đó trong disconnect này sẽ trả về 1 socket.id của tab đã đóng -> Lấy socket ID đó so sánh với mảng bên trên để trả về username
	// Disconnect socket
	socket.on('disconnect', function(){
		//lấy được username từ cookie nhưng do socketIO lấy liên tục nên có thể xuất hiện giá trị null
		let usernameToDelete = returnUsernameInArrayWhenComparingSocketIDTabClose(cookieObjectArray, socket.id);	
		//Lọc giá trị null chỉ lấy username chuẩn bị xóa 
		addUsernameToUsernameArrayToDelete(usernameToDelete, usernameArrayToDelete);

		//So lại một lần nữa với mảng chứa username sẽ xóa và thực hiện lệnh xóa khỏi ds 
		if(checkUsernameExistInArrayToDelete(usernameArrayToDelete, usernameToDelete)){
			usernameArray.splice(usernameArray.indexOf(usernameToDelete), 1);
			updateUsernames();
		}

		console.log("Username chuan bi xoa la: " + usernameToDelete);
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s socket connected', connections.length);
	});

	// Khi gửi tin nhắn sẽ xem ten username trongcookie
	socket.on('send message', messageToPrint => {
		let cookieGetFromInboxPage = socket.handshake.headers.cookie;
		let cookieInboxPage = cookie.parse(socket.handshake.headers.cookie);

		let userReceive = returnUsernameSortInUsernameArray(cookieInboxPage.username, usernameArray);
		console.log("Username hien tai la: " + userReceive);
		//Hàm này sẽ gửi đi message với msg chính là cái message mà nhập trong ô message và user chính là ng nhập
		io.sockets.emit('new message', {msg: messageToPrint, user: userReceive});
	});

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

