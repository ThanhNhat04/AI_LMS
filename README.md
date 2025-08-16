# AI_LMS
# AI_LMS

AI_LMS là hệ thống quản lý học tập trực tuyến với chức năng chấm điểm tự động, giúp giáo viên và học viên quản lý, theo dõi quá trình học tập hiệu quả. Dự án xây dựng trên nền tảng Next.js, React và Node.js, mang lại giao diện hiện đại, dễ sử dụng và khả năng mở rộng cao.

## Tính năng nổi bật

- Quản lý danh sách khóa học, xem chi tiết từng khóa
- Đăng nhập, đăng ký tài khoản người dùng
- Sidebar điều hướng tiện lợi
- Làm bài kiểm tra, chấm điểm tự động
- Thống kê kết quả và tiến độ học tập
- Giao diện responsive, tối ưu cho nhiều thiết bị
- Tích hợp API Moodle để đồng bộ dữ liệu khóa học

## Cài đặt & chạy dự án

### 1. Clone dự án
```bash
git clone <your-repo-url>
cd AI_LMS
```

### 2. Cài đặt các package
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env.local` và thêm biến sau:
```
NEXT_PUBLIC_MOODLE_TOKEN=your_moodle_token
```

### 4. Chạy server phát triển
```bash
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## Cấu trúc thư mục

- `app/` - Trang chính và logic ứng dụng
- `components/` - Các thành phần UI tái sử dụng
- `lib/` - Hàm tiện ích, xử lý dữ liệu
- `public/` - Tài nguyên tĩnh (ảnh, pdf, svg)
- `styles/` - CSS toàn cục

## Công nghệ sử dụng

- Next.js
- React
- Node.js
- CSS/SCSS
- Moodle API

## Đóng góp

Bạn có thể tạo pull request hoặc issue để đóng góp ý tưởng, sửa lỗi hoặc bổ sung tính năng mới.

## Liên hệ
ThanhNhat
