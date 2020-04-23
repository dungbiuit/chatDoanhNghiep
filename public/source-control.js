let socket = io("http://localhost:3000");
$(document).ready( () =>{
	$("#sign-in-button").click( () => {
		socket.emit("Client-send-sign-in", $("#email-address").val());	
	});	
});
