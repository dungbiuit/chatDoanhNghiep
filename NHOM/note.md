# File hướng dẫn project web chat room

	## Các kiến thức cần xem: 
	###	1. SocketIO(lệnh emit, on)
			- io.sockets.emit(): Gửi đến toàn bộ users
			- socket.emit() và socket.on() sử dụng với riêng 1 socket... và thường sẽ đi kèm với 1 biến truyền qua lại giữa client và server

	###	2. Cú pháp viết hàm của Biu trong js: `const  tên hàm = (các tham số truyền vào ) => {}`. Có thể tìm hiểu bằng từ khóa **EJ6 Arrow Function và Functional Programming**


# Luồng chạy của chương trình:
## Bắt đầu từ trangchu.ejs, người dùng gõ username 
-> server sẽ nhận tên người dùng đó và đưa vào cookie dưới dạng GET 
-> Đầu tiên username đó sẽ được kiểm tra bằng hàm *isUsernameValidToAddToArray()* để đảm bảo username đó không trùng
-> Nếu thành công thì thực hiện hàm *addUsernameToArray()* để thêm username vào danh sách

## Qúa trình từ lúc gửi 1 user gửi message cho đến khi message hiện lên cho tất cả người dùng
-> Ở *inbox.ejs* sau khi người dùng bấm nút gửi message, ta sẽ bắt sự kiện bằng dòng lệnh dưới

`				$messageForm.submit(function (e) {
					e.preventDefault();
					socket.emit('send message', $message.val());
					$message.val('');
				});
`

--> *inbox.ejs* đã emit('send message') và server sẽ nhận được bằng lệnh socket.on('send message').

--> Do ta chỉ gửi đi message nên để nhận biết user ta cần so sánh **cookie của trang hiện tại** (đã lưu biến username khi nhập từ trangchu.ejs). Lấy username qua đoạn hàm sau: 
`		let cookieGetFromInboxPage = socket.handshake.headers.cookie;
		let cookieInboxPage = cookie.parse(socket.handshake.headers.cookie);

		let userReceive = returnUsernameSortInUsernameArray(cookieInboxPage.username, usernameArray);
`

Trong đó userReceive sẽ được kiểm tra trong mảng usernameArray[] để chắc chắn username có tồn tại.

`		io.sockets.emit('new message', {msg: messageToPrint, user: userReceive});
`

Tới bước này thì ta đã có được 2 thông tin cần thiết: *username và message* -> Khi sang *inbox.ejs* sẽ socket.on('new message') sự kiện này và in ra màn hình message và username.
      
## Qúa trình **server** phát hiện người dùng thoát và cập nhật lại danh sách username trong phòng

> Trước hết các danh sách chính của chương trình được quản lý bằng mảng usernameArray[] -> Khi người dùng gõ username cũng là lúc danh sách được cập nhật `usernameArray.push(...)` 

-> Cơ chế socketIO chỉ nhận diện được khi một kết nối bị ngắt(tắt tab, refresh trang, redirect, nhấn nút thoát) thông qua lệnh `socket.on('disconnect')` và chỉ nhận diện thông qua biến *io* trong **cookie**.

-> Chính vì vậy ta phải có mảng cookieObjectArray[] để mỗi phần tử là 1 object có thược tính **username và io**

`		cookieObjectArray.push({SocketIOCookie:socketIDOfCurrentTab, UsernameCookie:cookieInboxPage.username});
`

-> Khi nhận biết được id ta sẽ dò lại và trả về username và cho vào mảng usernameArrayToDelete[] để chứa các username chuẩn bị xóa

`			usernameArray.splice(usernameArray.indexOf(usernameToDelete), 1);
`
-> Hàm này sẽ cập nhật lại mảng usernameArray[] sẽ được xóa 

-> note nhỏ: để danh sách luôn được load lại mỗi khi refresh ta sẽ so sánh với username có trong cookie và thêm vào mảng usernameArray[] lại ở trong hàm *	socket.on("Send socketID of current tab", (socketIDOfCurrentTab) => {}*

		
