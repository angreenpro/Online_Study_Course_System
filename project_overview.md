# TỔNG QUAN DỰ ÁN: HỆ THỐNG QUẢN LÝ KHÓA HỌC TRỰC TUYẾN (E-LEARNING)

## 1. Bối cảnh và mục tiêu bài toán
Trong bối cảnh chuyển đổi số mạnh mẽ hiện nay, nhu cầu học tập trực tuyến ngày càng gia tăng. Các nền tảng học trực tuyến như Udemy, Coursera, edX yêu cầu một hệ thống quản lý dữ liệu hiệu quả nhằm hỗ trợ hoạt động giảng dạy, học tập và quản trị.

Bài toán đặt ra là xây dựng cơ sở dữ liệu cho một hệ thống quản lý khóa học trực tuyến, đảm bảo khả năng lưu trữ, xử lý và khai thác dữ liệu phục vụ các nghiệp vụ thực tế của nền tảng e-learning.

## 2. Các đối tượng tham gia hệ thống
Hệ thống gồm các đối tượng chính sau:
- **Người dùng (Users):** bao gồm học viên và giảng viên.
- **Giảng viên (Instructors):** tạo và quản lý khóa học.
- **Khóa học (Courses):** nội dung đào tạo thuộc nhiều lĩnh vực công nghệ.
- **Học viên:** đăng ký khóa học, học tập và đánh giá.

## 3. Yêu cầu về dữ liệu

### 3.1. Quản lý người dùng
Hệ thống cần lưu trữ thông tin người dùng bao gồm họ tên, email, mật khẩu (đã mã hóa) và avatar. Email phải là duy nhất để đảm bảo xác định chính xác mỗi người dùng.

Một người dùng có thể đồng thời đảm nhiệm **nhiều vai trò** (ví dụ: vừa là Học viên vừa là Giảng viên). Do đó, hệ thống sử dụng bảng phân quyền riêng (`UserRole`) để quản lý mối quan hệ nhiều-nhiều giữa người dùng và vai trò, thay vì lưu vai trò dưới dạng chuỗi đơn. Các vai trò hỗ trợ: `STUDENT`, `INSTRUCTOR`, `ADMIN`.

Mỗi thực thể chính trong hệ thống đều có các trường kiểm soát thời gian (`createdAt`, `updatedAt`) để theo dõi lịch sử thay đổi (Audit Trail), và trường `deletedAt` hỗ trợ **xóa mềm (Soft Delete)** — đảm bảo dữ liệu không bị mất khi người dùng hoặc admin thực hiện thao tác xóa.

### 3.2. Quản lý giảng viên
Mỗi giảng viên là một người dùng có chuyên môn cụ thể. Giảng viên có thể tạo và quản lý nhiều khóa học khác nhau.

### 3.3. Quản lý khóa học
Mỗi khóa học thuộc về một giảng viên và có các thông tin cơ bản như:
- Tên khóa học
- Mô tả
- Giá tiền
- Trình độ (Beginner, Intermediate, Advanced)

Khóa học được tổ chức theo cấu trúc phân cấp gồm nhiều section, mỗi section chứa nhiều bài học.

### 3.4. Quản lý nội dung bài học
Mỗi bài học thuộc duy nhất một section và một khóa học. Thông tin bài học bao gồm:
- Tên bài học
- Thứ tự hiển thị
- Thời lượng
- Loại bài học (video, reading, quiz)

### 3.5. Quản lý đăng ký và thanh toán
Học viên có thể đăng ký nhiều khóa học. Hệ thống tách biệt rõ ràng hai thực thể:

**a) Đăng ký (Enrollment):** Lưu thông tin đăng ký khóa học, bao gồm:
- Ngày đăng ký
- Trạng thái đăng ký (ACTIVE, EXPIRED, CANCELLED)

**b) Thanh toán (Payment):** Mỗi lần đăng ký tạo ra một bản ghi thanh toán riêng biệt, bao gồm:
- Số tiền gốc (originalPrice)
- Số tiền thực trả (finalPrice)
- Phương thức thanh toán (paymentMethod: CREDIT_CARD, BANK_TRANSFER, E_WALLET)
- Mã giao dịch từ cổng thanh toán (transactionId)
- Trạng thái thanh toán (PENDING, COMPLETED, FAILED, REFUNDED)
- Ngày thanh toán

**c) Mã giảm giá (Coupon):** Hệ thống hỗ trợ quản lý mã giảm giá với các thông tin:
- Mã coupon (duy nhất)
- Loại giảm giá (PERCENTAGE hoặc FIXED_AMOUNT)
- Giá trị giảm
- Ngày bắt đầu và kết thúc hiệu lực
- Số lần sử dụng tối đa và số lần đã sử dụng
- Trạng thái hoạt động (isActive)

Khi thanh toán, nếu học viên áp dụng mã giảm giá hợp lệ, hệ thống tự động tính giá sau giảm và ghi nhận vào bản ghi Payment.

### 3.6. Quản lý tiến độ học tập
Hệ thống theo dõi tiến độ học tập của học viên theo từng bài học. Mỗi bản ghi tiến độ thể hiện trạng thái học tập (chưa học, đang học, hoàn thành) và thời điểm cập nhật cuối cùng.

### 3.7. Quản lý đánh giá và kiểm tra
Học viên có thể đánh giá khóa học thông qua điểm số (1-5 sao) và nhận xét. **Chỉ những học viên đã đăng ký khóa học (có bản ghi Enrollment hợp lệ) mới được phép đánh giá**, nhằm đảm bảo tính xác thực của các đánh giá. Mỗi học viên chỉ được đánh giá một khóa học đúng một lần.

Ngoài ra, hệ thống ghi nhận kết quả làm bài kiểm tra (quiz), bao gồm điểm số và trạng thái đạt hoặc không đạt.

### 3.8. Quản lý tương tác và bài tập mở rộng (Bổ sung mới)
Để tăng tính tương tác cho dự án quy mô vừa và nhỏ, hệ thống lưu trữ thêm:
- **Ghi chú cá nhân (Notes):** Ghi chú của học viên được lưu kèm mốc thời gian (timestamp) của video để dễ dàng ôn tập.
- **Thảo luận (Q&A):** Hệ thống hỏi đáp trực tiếp dưới mỗi bài học, hỗ trợ thảo luận giữa học viên và giảng viên theo cấu trúc cây (reply).
- **Chứng chỉ (Certificate):** Tự động cấp và lưu trữ chứng chỉ (file PDF/Image) khi học viên hoàn thành 100% khóa học.

### 3.9. Quản lý thông báo (Notification - Bổ sung mới)
Hệ thống hỗ trợ gửi và quản lý thông báo đến người dùng, bao gồm:
- **Thông báo hệ thống:** Thông báo tự động khi có sự kiện quan trọng (đăng ký thành công, hoàn thành khóa học, nhận chứng chỉ, thanh toán thành công/thất bại).
- **Thông báo từ giảng viên (Announcements):** Giảng viên có thể gửi thông báo cập nhật nội dung khóa học đồng loạt đến tất cả học viên đang đăng ký.
- **Trạng thái đọc:** Mỗi thông báo có trạng thái đã đọc/chưa đọc để người dùng dễ dàng theo dõi.

Thông tin thông báo bao gồm: loại thông báo (type), tiêu đề, nội dung, người nhận, trạng thái đọc (isRead), và thời gian tạo.

## 4. Các chức năng nghiệp vụ chính
Hệ thống cần hỗ trợ các chức năng nghiệp vụ sau:
- Quản lý người dùng và **phân quyền đa vai trò**.
- Quản lý khóa học và nội dung giảng dạy.
- Đăng ký khóa học và xử lý thanh toán **(tách riêng Payment, hỗ trợ Coupon)**.
- Theo dõi tiến độ học tập của học viên.
- Đánh giá chất lượng khóa học và kết quả học tập **(ràng buộc với Enrollment)**.
- Thống kê và phân tích doanh thu, mức độ tham gia học tập.
- **Tương tác học tập:** Hỗ trợ đặt câu hỏi Q&A và tạo ghi chú cá nhân tại các mốc thời gian của video.
- **Cấp phát chứng chỉ tự động.**
- **Quản lý thông báo (Mới):** Gửi thông báo hệ thống và thông báo từ giảng viên đến học viên.
- **Hỗ trợ Soft Delete & Audit Trail (Mới):** Xóa mềm và theo dõi lịch sử thay đổi trên toàn bộ thực thể.

## 5. Các quy trình nghiệp vụ

### 5.1. Quy trình đăng ký và học khóa học
Người dùng đăng ký tài khoản và đăng nhập hệ thống, lựa chọn khóa học mong muốn, thực hiện đăng ký và thanh toán. Sau khi đăng ký thành công, học viên bắt đầu học tập và hệ thống ghi nhận tiến độ theo từng bài học.

### 5.2. Quy trình tạo và quản lý khóa học
Giảng viên đăng nhập hệ thống, tạo khóa học mới, xây dựng cấu trúc gồm các section và bài học. Sau khi hoàn tất nội dung, khóa học được công bố để học viên đăng ký.

### 5.3. Quy trình đánh giá và kiểm tra
Trong quá trình học, học viên thực hiện các bài kiểm tra. Hệ thống chấm điểm, lưu kết quả và cho phép học viên đánh giá khóa học sau khi hoàn thành.

---

## 6. Đề xuất Công nghệ (Tech Stack) & Lộ trình (Bổ sung thêm)

### 6.1. Đề xuất Công nghệ (Tech Stack)
Để đáp ứng bài toán lưu trữ và xử lý như trên, đề xuất sử dụng:
- **Frontend:** React.js / Next.js, Tailwind CSS
- **Backend:** Node.js (Express/NestJS) hoặc Spring Boot / Django
- **Cơ sở dữ liệu (Database):** PostgreSQL hoặc MySQL (Rất phù hợp với cấu trúc dữ liệu quan hệ được mô tả trong bài toán).
- **Lưu trữ tĩnh (Storage):** AWS S3 hoặc Cloudinary để lưu trữ video và hình ảnh.

### 6.2. Lộ trình phát triển (Roadmap)
- **Giai đoạn 1 (MVP):** Tập trung vào CSDL cốt lõi, quản lý người dùng (đa vai trò), quản lý khóa học và quy trình học cơ bản. Áp dụng Soft Delete & Audit Trail ngay từ đầu.
- **Giai đoạn 2:** Bổ sung Payment (tách riêng), Coupon/Discount, đánh giá (ràng buộc Enrollment), kiểm tra (quiz) và theo dõi tiến độ chi tiết.
- **Giai đoạn 3:** Tương tác (Q&A, Notes), chứng chỉ tự động, hệ thống thông báo (Notification), thống kê doanh thu, báo cáo nâng cao và tối ưu hóa hệ thống.
