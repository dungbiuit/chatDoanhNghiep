let express = require("express");

let body_parser = require("body-parser");
let app = express();

app.use(express.static("public"));
app.use(body_parser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "./views");

let server = require("http").Server(app);
let io = require("socket.io")(server);
server.listen(3000);

//Biến toàn cục quan trọng
let usersArray = [];

io.on("connection", (socket) =>{
	console.log("có người log vào với id là  " + socket.id);

	socket.on("client-send-sign-in", datareceive => {
		console.log("tên người dùng này là " + datareceive);
	});


})
//Điều hướng app (routes)
//Route đến trang chủ khi nhập localhost:3000
app.get("/", (request, respond) => {
	respond.render("trangchu");
});
//Route đến trang đăng ký khi nhấn vào link đăng ký trong trang chủ
app.get("/trangdangky", (request,respond) => {
	respond.render("trangdangky");
});
//Xử lý các điều kiện đăng ký thành viên 
app.post("/trangdangky", (request,respond) => {
	let userReceive = returnUserAfterClickSignUp(request);
	console.log(userReceive);
	let webPageRender = returnWebPageAfterCheckPassword(userReceive.firstTypePassword, userReceive.retypePassword);
	respond.redirect(webPageRender);
	addUserToUserArray(userReceive, usersArray);
	console.log(usersArray);
});

app.get("/post-sign-in", (request,respond) => {
	respond.render("post-sign-in");
});
// Hàm xử lý 
const returnWebPageAfterCheckPassword = (firstPassword, retypePassword) =>{
	let webPageReturn = "";
	if(checkRetypePassword(firstPassword, retypePassword)){
		webPageReturn = "/"
	}
	else
		webPageReturn = "trangdangky";
	return webPageReturn;
}

const checkRetypePassword = (firstPassword, retypePassword) => {
	if(firstPassword !== retypePassword){
		return false;
	}
	return true;
}


const returnUserAfterClickSignUp = (request) => {
	let userReturn = JSON.stringify(request.body);	
	userReturn = JSON.parse(userReturn);
	return userReturn;	
}

const addUserToUserArray = (userAdd, userArray) => {
	if(checkEmailExistionOfUserAdd(userAdd, userArray) === false 
		&&
		checkRetypePassword(userAdd.firstTypePassword, userAdd.retypePassword) ) {

		userArray.push(userAdd);
	}
	else
		console.log("Thêm thất bại");
}

const checkEmailExistionOfUserAdd = (userAdd, userArray) => {
	for (eachUser of userArray) {
		if(userAdd.emailSignUp === eachUser.emailSignUp) {
			return true;
		}
	}
	return false;
}
