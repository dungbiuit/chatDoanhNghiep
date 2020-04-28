let socket = io("http://localhost:3000");
let signUpButton = $("#sign-up-button");
const checkRetypePassword = (password, retypePassword) => {
    if(password !== retypePassword){
//     alert("Mật khẩu không trùng khớp, mời bạn nhập lại");   
        return false;
    }
    return true;
}
$(document).ready(() => { 
const signUpFunction = (signUpButton) =>{

	signUpButton.click( () => {
//       let passwordReceive =   checkRetypePassword($("#a").val(), $("#b").val()); 
	let userObject = {
		username_aa: $("#username-register").val(),
		email: $("#email-address-register").val() ,
 //       password: passwordReceive,       
	}
		socket.emit("Client-send-sign-up", userObject);
    });	
}
signUpFunction(signUpButton);
});