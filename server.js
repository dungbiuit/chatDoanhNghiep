let express = require("express");

let app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

let server = require("http").Server(app);
let io = require("socket.io")(server);
server.listen(3000);

io.on("connection", (socket) =>{
	console.log("Có người log vào với ID là  " + socket.id);

	socket.on("Client-send-sign-in", dataReceive => {
		console.log("Tên người dùng này là " + dataReceive);
	});
})
//Route đến trang chủ khi nhập localhost:3000
app.get("/", (request, respond) => {
	respond.render("trangchu");
});
//Route đến trang đăng ký khi nhấn vào link đăng ký trong trang chủ
app.get("/trangdangky", (request,respond) => {
	respond.render("trangdangky");
});

