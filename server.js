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

app.get("/", (request, respond) => {
	respond.render("trangchu");
});

