# Web_project_user

### Introduction:
- Chạy lệnh "npm install" để cài đặt các node-modules (không có global node-modules)
- Run hai script tạo Database và thêm data trong MySQL
- Tạo file ".env" chứa các thông tin database sẽ kết nối: DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST
- Chạy lệnh "npm start", để ý thông báo "Connection has been established successfully."

### Phase 03 tasks - Authentication:
- [ ] Xóa các file không dùng
- [ ] Đăng ký tài khoản
- [x] Đăng nhập
- [x] Hiện thông tin tài khoản
- [x] Đăng xuất
- [ ] Hosting code

### Thêm các biến môi trường sau vào file ".env" trước khi chạy:  
EMAIL_USER=<tài khoản gmail> (ex: EMAIL_USER=abc@gmail.com)
EMAIL_PASS=<password của tài khoản gmail trên> (ex: EMAIL_PASS=123456)

DEPLOY_ENV=http://localhost:3000
