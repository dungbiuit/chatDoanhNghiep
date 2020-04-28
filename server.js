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

io.on("connection", (socket) =>{
	console.log("có người log vào với id là  " + socket.id);

	socket.on("client-send-sign-in", datareceive => {
	console.log("tên người dùng này là " + datareceive);
	});

//	socket.on("client-send-sign-up", userreceive  => {
	//	console.log("username: " + userreceive.username);
//	});

})
//Route đến trang chủ khi nhập localhost:3000
app.get("/", (request, respond) => {
	respond.render("trangchu");
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
