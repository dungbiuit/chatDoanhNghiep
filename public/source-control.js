let socket = io("http://localhost:3000");
let signUpButton = $("#sign-up-button");

$(document).ready(() => {
  $("#sign-in-button").click(() => {
    socket.emit("Client-send-sign-in", $("#username").val());
  });

});
