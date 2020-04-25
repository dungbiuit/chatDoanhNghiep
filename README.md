# Các bước thực hiện trên git
## Các bước thực hiện qua lệnh git trên terminal (hoặc Command Prompt nếu xài Windows)
### **Lần đầu sử dụng**
1. `git clone + url https`
2. Chạy lệnh `npm install` 

3.Lên terminal (CP) gõ `node server.js` để khởi động server

4.Trên thanh URL của trình duyệt gõ http://localhost:3000 để chạy web là file *trangchu.ejs*

### **Lần sử dụng tiếp theo**
1. Chỉ cần gõ lệnh `git pull origin master` sẽ tự động update toàn bộ file trong project

## Thao tác update lên repository
1. Đầu tiên kiểm tra tình trạng các file bằng lệnh `git status` . Nếu file màu đỏ là mới chỉnh sửa/chưa thêm, file màu xanh là đã thêm thành coog
2. `git add .` thêm tất cả file hoặc có thể add các file mong muốn theo tên thay bằng dấu chấm.
3. `git commit -m "Lời nhắn muốn gửi để mọi người thấy"` - **Bước này rất quan trọng để có thể xem lại mọi người đã chỉnh sửa cái gì 
4. `git push origin master` để gửi các thay đổi lên repo -> Bước này sẽ yêu cầu nhập username/pass của tài khoản github cá nhân
*Có thể check lại trên repo xem file đã lên hay chưa*

## File giaoviec.md  nằm trong folder *nhom* được viết bằng Markdown. Mọi người có thể xem file này bằng plugins Markdown của bất kì Editor nào


