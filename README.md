# 🎓 Online Study System

Một hệ thống nền tảng học trực tuyến (E-Learning) toàn diện, bao gồm cả hệ thống Backend (RESTful API) và Frontend (Web Application). Nền tảng hỗ trợ nhiều vai trò người dùng khác nhau như Học viên (Student), Giảng viên (Instructor) và Quản trị viên (Admin) với đầy đủ các tính năng từ quản lý khóa học, thanh toán, tiến độ học tập đến cấp phát chứng chỉ.

## 🚀 Công nghệ sử dụng (Tech Stack)

### Backend (`/BE`)
- **Node.js & Express.js:** Framework xây dựng RESTful API.
- **TypeScript:** Ngôn ngữ lập trình chính, đảm bảo an toàn kiểu dữ liệu (Type Safety).
- **Prisma ORM:** Quản lý cơ sở dữ liệu và tự động tạo Types.
- **SQLite:** Cơ sở dữ liệu mặc định dùng cho môi trường dev (có thể dễ dàng chuyển sang PostgreSQL/MySQL qua Prisma).
- **Zod:** Validate dữ liệu đầu vào.
- **JWT (JSON Web Token):** Xác thực và phân quyền người dùng.
- **Helmet & Rate Limit:** Tăng cường bảo mật API và chống brute-force.
- **Multer:** Quản lý upload file.

### Frontend (`/FE`)
- **Next.js 14+:** React framework với Server Components, App Router.
- **TypeScript:** Đồng bộ kiểu dữ liệu với Backend.
- **Tailwind CSS v4:** Styling và UI design hiện đại.
- **Axios:** Xử lý HTTP requests.
- **js-cookie:** Quản lý token phía client.

---

## 🌟 Tính năng nổi bật

### Phân quyền người dùng (RBAC)
- **Học viên (Student):** Tìm kiếm khóa học, mua/đăng ký, học video, làm bài quiz trắc nghiệm, trao đổi thảo luận, nhận chứng chỉ.
- **Giảng viên (Instructor):** Tạo và chỉnh sửa khóa học, upload video, theo dõi doanh thu, gửi thông báo cho học viên.
- **Admin:** Quản lý người dùng, quản lý tất cả khóa học, tạo mã giảm giá (Coupon), xem thống kê doanh thu toàn hệ thống.

### Modules chính
- **Xác thực (Auth):** Đăng ký, Đăng nhập, Refresh Token.
- **Khóa học (Course):** Quản lý Course, Section, Lesson (hỗ trợ lưu trữ theo thứ tự bài giảng).
- **Học tập & Trắc nghiệm (Learning & Quiz):** Lưu tiến độ học (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`), chấm điểm và đánh giá bài test trắc nghiệm.
- **Giao dịch (Payment & Enrollment):** Xử lý đăng ký học, thanh toán và áp dụng mã giảm giá.
- **Tương tác (Interaction):** Hệ thống ghi chú (Note) cá nhân theo timestamp video, thảo luận (Q&A) dưới bài giảng.
- **Đánh giá (Review):** Học viên có thể rate và để lại review sau khi hoàn thành khóa học.
- **Chứng chỉ (Certificate):** Tự động tạo và cấp phát chứng chỉ code unique khi hoàn thành 100% bài học và vượt qua quiz.
- **Thông báo (Notification):** Gửi thông báo trong hệ thống.

---

## 🛠 Hướng dẫn cài đặt & Chạy dự án (Local Development)

### 1. Yêu cầu hệ thống
- **Node.js:** v18.x hoặc cao hơn
- **npm** hoặc **yarn**

### 2. Cài đặt Backend
Di chuyển vào thư mục BE và cài đặt các thư viện:
```bash
cd BE
npm install
```

Copy file `.env.example` thành `.env` và thiết lập (Mặc định đã được cấu hình sẵn cho SQLite):
```bash
cp .env.example .env
```

Khởi tạo cơ sở dữ liệu (Prisma):
```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed  # (Tùy chọn) Chạy seed dữ liệu mẫu
```

Khởi động server Backend:
```bash
npm run dev
```
> Server API sẽ chạy tại: `http://localhost:3001`

### 3. Cài đặt Frontend
Mở một terminal khác, di chuyển vào thư mục FE và cài đặt các thư viện:
```bash
cd FE
npm install
```

Khởi động web application:
```bash
npm run dev
```
> Giao diện web sẽ chạy tại: `http://localhost:3000`

---

## 📂 Cấu trúc thư mục (Project Structure)

### Backend (`/BE/src/`)
```text
src/
├── config/           # Cấu hình môi trường (env, db, constants)
├── middleware/       # Middleware (auth, rbac, error handler, validate)
├── modules/          # Các chức năng của hệ thống (Domain-driven)
│   ├── auth/         # Đăng nhập, đăng ký
│   ├── course/       # Quản lý khóa học, bài giảng
│   ├── learning/     # Học tập, tiến độ, bài trắc nghiệm
│   ├── payment/      # Đăng ký và thanh toán
│   ├── interaction/  # Ghi chú, bình luận
│   ├── admin/        # Dashboard thống kê, mã giảm giá
│   └── ...           
├── utils/            # Các tiện ích dùng chung (response formatter, helpers)
├── app.ts            # Khởi tạo Express App
└── server.ts         # Điểm bắt đầu khởi chạy Server
```

### Frontend (`/FE/src/`)
```text
src/
├── app/              # Next.js App Router (Các trang UI)
├── components/       # Các React components dùng chung (Buttons, Cards, Modals)
├── lib/              # Tiện ích, Axios client, config
├── types/            # Khai báo TypeScript types
└── ...
```

---

## 🔒 Bảo mật (Security Guidelines)

- **JWT Auth:** Token không bao giờ được thiết lập fallback mặc định ở môi trường production.
- **Bảo mật Header & Rate Limit:** Hệ thống tích hợp sẵn `Helmet` và `Express-Rate-Limit` chống DDOS và Brute Force (đặc biệt ở các route `/api/auth`).
- **Phân quyền chặt chẽ:** Tất cả các thao tác thay đổi dữ liệu đều được kiểm tra ownership (vd: giảng viên chỉ có quyền sửa khóa học của chính mình).
