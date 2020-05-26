# Ngày 26/5
## Việc của chung
- [x] Tìm cách xóa username sau khi đóng tab (Có comment code **TODO**  hướng đi hoặc tìm )
- [ ] Test lại app xem còn lỗi nào lớn không 
# Ngày 24/5
## Việc của chung
- Tìm cách đưa app lên **ngrok** (Nghe nói app này dạng như localhost cho mọi người luôn nên có thể thử)

## Việc của riêng
## Đăng
- [ ] Đổi giao diện sang nền trắng chữ đen hoặc bộ màu nào có thể nổi bật dòng text và tên người gửi
- [ ] Tìm cách nhấn vào 1 nút có thể đổi sang 1 theme khác (VD màu nền và màu chữ khác ) -> Thử jquery hoặc gắn hàm cho button xem 
## Hậu
- [ ] Xác định người user đầu tiên là chủ phòng; chỉ có chủ phòng mới hiện được nút Kick các thành viên khác (từ khóa **ejs template** )
- [ ] Tìm cách đưa app lên **ngrok**

## Biu 
- [ ] Tìm cách kick user sau khi nhấn nút Kick 
- [ ] Đưa app lên **ngrok** hoặc **heroku**

- [ ] Format lại code cho đẹp :)) 
# Do lịch đến thứ 6 tuần sau và chỉ còn vài chức năng phụ nên mọi người nhớ cố gắng hoàn tất task càng sớm càng tốt để có thời gian cho những môn khác

# Ngày 5/5

## Việc của chung 
- Bổ sung chức năng chat cho 1 nhóm người nhất định 

## Việc của riêng
## Đăng

- [ ] Hoàn tất giao diện trang inbox.ejs (Tìm từ khóa **TODO**  để biết các dòng sinh thêm trong chat)

- [ ] Tham khảo phần Backend  các cơ chế socket.on soccet.emit 

## Hậu 
- [] Xem chức năng khi vào phòng đều thông báo ở các cửa sổ người dùng khác

## Biu
- [] Thêm chức năng chọn được người để nói chuyện riêng 
# Ngày 30/4

## Việc của chung 
- Tìm hiểu về cách lấy dữ liệu từ định dạng JSON 
## Việc của riêng

## Đăng
- [] Tiếp tục hoàn tất layout trang post-sign-in.ejs và

- [] Hỗ trợ Hậu phần chat **khi chat mọi người đều có thể thấy**

## Hậu 

- [] Tiếp tục xem clip hướng dẫn SocketIO
- [] Cố gắng hoàn tất  trang khi vào phòng chat 

##Biu

- [] Tìm cách lưu lại mảng user
- [] Khi vào trang post-sign-in sẽ hiện các thông tin người dùng hiện tại 






#Ngày 26/4
## Việc của chung
1. Xem 2 clip trên Youtube để hiểu rõ về nguyên lý SocketIO https://www.youtube.com/watch?v=ofptoO93IFI&t=3932s và https://www.youtube.com/watch?v=ovAeRVUiuvA&t=1736s
2. Khái quát giao diện trang web như thế nào *Do t chỉ lo nhiều phần back-end nên có thể phần không góp nhiều được. Mà có nguồn này chỉnh css nhanh nếu cần và t đã thêm dưới dạng packet rồi nên cứ chép source thoải mái https://tachyons.io/components/ nhé :))*

3. Hiện tại đang gặp vấn đề ở phần sau khi nhấn **Sign In** thì nó không chuyển URL sang trang *greeting.ejs* Nên ai fix được thì cứ commit lên để chuyển sang phần khác

## Việc của riêng
## Mọi người làm xong việc nào cứ đánh dấu x bên trong ngoặc vuông nó sẽ tự hiện thành công và sau này git push sẽ update để mọi người cùng thấy
### Đăng 

-  [X]  Task bị hủy do thiết kế lại toàn bộ giao diện. /*Chỉnh lại trang greeting.ejs sao cho có hình xác nhận và tên người mới nhập + nút bấm xác nhận để qua trang tiếp theo  (có thể tên chưa cần từ cái nhập bên username nên có thể gán cứng ).*/

- [x]  Tìm hiểu khái niệm **"routes"** trong express giúp t cách điều hướng trang URL 

### Hậu 
- [ ] Thêm chức năng trò chuyện 1 mình (kiểu mình gõ gì xong nó trả lời lại luôn) trên 1 trang web mới (đuôi ejs)

- [ ] Giúp t cách extends cái socket để nó có thể lưu trữ được **username + pass** để sau này dễ nhận biết loại nhân viên

### Biu

- [x] hỗ trợ Hậu cái extends và chức năng thêm thành viên thông qua đăng ký

*AI chưa xong việc hay có khó khăn cứ í ới trên group sẽ cùng nhau giúp đỡ :))*
