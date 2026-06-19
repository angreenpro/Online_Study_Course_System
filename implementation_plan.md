# Implementation Plan: Hệ thống E-Learning

Dựa trên thiết kế kiến trúc đã hoàn thành (4 tài liệu phân tích), xây dựng hệ thống E-Learning hoàn chỉnh gồm **Frontend (Next.js)**, **Backend (Express.js)**, và **Database (PostgreSQL + Prisma)**.

## Tech Stack xác nhận

| Layer | Công nghệ | Ghi chú |
|-------|-----------|---------|
| **Frontend** | Next.js 14+ (App Router), Tailwind CSS | SSR, SEO tốt, giao diện Tiếng Việt |
| **Backend** | Express.js + TypeScript | Đơn giản, linh hoạt |
| **Database** | PostgreSQL + Prisma ORM | Type-safe, auto migration |
| **Auth** | JWT (Access + Refresh Token), bcrypt | Theo thiết kế kiến trúc |
| **File Storage** | Upload local (dev), AWS S3 ready (prod) | Video, ảnh, chứng chỉ |
| **Cache** | Redis (optional ở MVP) | Session, cache |

---

## Cấu trúc Thư mục Tổng thể

```
online_study_system/
├── FE/                          # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── (auth)/          # Login, Register
│   │   │   ├── (main)/          # Layout chính (có sidebar/header)
│   │   │   │   ├── courses/     # Danh sách, chi tiết khóa học
│   │   │   │   ├── learn/       # Learning Player
│   │   │   │   ├── dashboard/   # User Dashboard
│   │   │   │   ├── instructor/  # Instructor Dashboard
│   │   │   │   └── admin/       # Admin Panel
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx         # Landing page
│   │   ├── components/          # Shared components
│   │   │   ├── ui/              # Button, Input, Modal, Card...
│   │   │   ├── layout/          # Header, Sidebar, Footer
│   │   │   └── features/        # Feature-specific components
│   │   ├── lib/                 # Utilities, API client, auth
│   │   ├── hooks/               # Custom React hooks
│   │   ├── styles/              # Global CSS, design tokens
│   │   └── types/               # TypeScript types
│   ├── public/                  # Static assets
│   ├── next.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── BE/                          # Express.js Backend
│   ├── src/
│   │   ├── config/              # DB, env, constants
│   │   ├── middleware/          # auth, rbac, errorHandler, validation
│   │   ├── modules/             # Feature modules
│   │   │   ├── auth/            # controller, service, routes, validator
│   │   │   ├── user/
│   │   │   ├── course/
│   │   │   ├── enrollment/
│   │   │   ├── payment/
│   │   │   ├── learning/
│   │   │   ├── interaction/
│   │   │   └── notification/
│   │   ├── utils/               # Helpers, logger, response formatter
│   │   └── app.ts               # Express app setup
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── package.json
│   └── tsconfig.json
│
├── Data/                        # Database scripts & documentation
│   ├── migrations/              # Prisma migration history
│   ├── seeds/                   # Seed data scripts
│   ├── erd.md                   # ERD documentation
│   └── queries/                 # Common queries, views, indexes
│
└── [Existing design docs]
```

---

## Các quyết định đã xác nhận ✅

| Quyết định | Lựa chọn |
|------------|----------|
| **CSS Framework** | Tailwind CSS |
| **Payment Gateway** | Mock/tượng trưng — không tích hợp thật |
| **Ngôn ngữ giao diện** | Tiếng Việt (code & API vẫn tiếng Anh) |
| **File Upload** | Upload local (`/uploads`) ở MVP, AWS S3 khi deploy production |

---

## Proposed Changes — Chia theo 5 Phase

Mỗi Phase tương ứng với 1 Construction Iteration trong quy trình RUP đã thiết kế.

---

### Phase 1: Nền tảng & Xác thực (C1)

**Mục tiêu**: Setup project, database schema cốt lõi, Auth (đăng ký/đăng nhập), phân quyền RBAC.

**Entities liên quan**: `User`, `UserRole`

---

#### Database (Data + Prisma Schema)

##### [NEW] [schema.prisma](file:///d:/VS%20Code/online_study_system/BE/prisma/schema.prisma)

Prisma schema ban đầu với 2 model `User` và `UserRole`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  STUDENT
  INSTRUCTOR
  ADMIN
}

model User {
  id        String    @id @default(uuid())
  fullName  String
  email     String    @unique
  password  String
  avatarUrl String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  roles UserRole[]
  // Relationships added in later phases
}

model UserRole {
  id         String   @id @default(uuid())
  userId     String
  role       Role
  assignedAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@unique([userId, role])
}
```

##### [NEW] [seed.ts](file:///d:/VS%20Code/online_study_system/Data/seeds/seed.ts)

Script seed data tạo admin mặc định, 2-3 instructor, 5-10 student mẫu.

##### [NEW] [erd.md](file:///d:/VS%20Code/online_study_system/Data/erd.md)

Tài liệu ERD (Entity Relationship Diagram) dạng Mermaid, map từ Class Diagram đã thiết kế.

---

#### Backend (Express.js)

##### [NEW] [package.json](file:///d:/VS%20Code/online_study_system/BE/package.json)

Init project với dependencies: `express`, `prisma`, `@prisma/client`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`, `zod` (validation), `typescript`, `tsx`.

##### [NEW] [app.ts](file:///d:/VS%20Code/online_study_system/BE/src/app.ts)

Express app setup: middleware (cors, json parser, error handler), route mounting.

##### [NEW] [config/](file:///d:/VS%20Code/online_study_system/BE/src/config)

- `database.ts` — Prisma Client singleton
- `env.ts` — Environment variables validation
- `constants.ts` — Enums, magic numbers

##### [NEW] [middleware/](file:///d:/VS%20Code/online_study_system/BE/src/middleware)

- `auth.middleware.ts` — JWT verify, extract userId
- `rbac.middleware.ts` — Role-based access control (kiểm tra UserRole)
- `errorHandler.ts` — Global error handler
- `validate.ts` — Zod validation middleware

##### [NEW] [modules/auth/](file:///d:/VS%20Code/online_study_system/BE/src/modules/auth)

| File | Mô tả |
|------|--------|
| `auth.routes.ts` | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh` |
| `auth.controller.ts` | Xử lý request/response |
| `auth.service.ts` | Business logic: hash password, tạo JWT, verify |
| `auth.validator.ts` | Zod schemas cho register/login |

**API Endpoints Phase 1:**

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|--------|
| POST | `/api/auth/register` | ❌ | Đăng ký (tự gán role STUDENT) |
| POST | `/api/auth/login` | ❌ | Đăng nhập, trả JWT |
| POST | `/api/auth/refresh` | 🔄 | Refresh token |
| GET | `/api/users/me` | ✅ | Lấy profile hiện tại |
| PUT | `/api/users/me` | ✅ | Cập nhật profile |
| GET | `/api/admin/users` | ✅ ADMIN | Danh sách users |
| PUT | `/api/admin/users/:id/roles` | ✅ ADMIN | Gán/xóa role |

##### [NEW] [modules/user/](file:///d:/VS%20Code/online_study_system/BE/src/modules/user)

- `user.routes.ts`, `user.controller.ts`, `user.service.ts` — Profile CRUD, admin user management.

##### [NEW] [utils/](file:///d:/VS%20Code/online_study_system/BE/src/utils)

- `response.ts` — Chuẩn hóa API response format `{ success, data, message, error }`
- `logger.ts` — Console logger (structured JSON)
- `pagination.ts` — Helper pagination (offset-based)

---

#### Frontend (Next.js)

##### [NEW] Next.js Project

Init bằng `npx create-next-app@latest ./` trong thư mục `FE/`.

##### [NEW] [styles/](file:///d:/VS%20Code/online_study_system/FE/src/styles)

- `globals.css` — Design tokens, CSS reset, Tailwind directives
- Color palette: Dark theme làm chủ đạo, gradient xanh tím (#6C63FF → #4ECDC4)

##### [NEW] [components/ui/](file:///d:/VS%20Code/online_study_system/FE/src/components/ui)

Bộ UI components cơ bản (premium design):
- `Button.tsx` — Primary, Secondary, Ghost variants với hover/active animations
- `Input.tsx` — Floating label input với validation states
- `Card.tsx` — Glass-morphism card
- `Modal.tsx` — Overlay modal
- `Avatar.tsx` — User avatar với fallback
- `Badge.tsx` — Role badges (Student, Instructor, Admin)
- `Spinner.tsx` — Loading spinner
- `Toast.tsx` — Notification toast

##### [NEW] [components/layout/](file:///d:/VS%20Code/online_study_system/FE/src/components/layout)

- `Header.tsx` — Top navigation bar (logo, search, user menu, notifications)
- `Sidebar.tsx` — Left sidebar (navigation links theo role)
- `Footer.tsx` — Footer

##### [NEW] [lib/](file:///d:/VS%20Code/online_study_system/FE/src/lib)

- `api.ts` — Axios instance, interceptors (attach JWT, handle 401)
- `auth.ts` — Auth context, useAuth hook, token management
- `utils.ts` — Format date, currency, etc.

##### [NEW] [app/(auth)/](file:///d:/VS%20Code/online_study_system/FE/src/app/(auth))

- `login/page.tsx` — Trang đăng nhập (premium design, gradient background, glass card)
- `register/page.tsx` — Trang đăng ký

##### [NEW] [app/(main)/dashboard/](file:///d:/VS%20Code/online_study_system/FE/src/app/(main)/dashboard)

- `page.tsx` — User dashboard (hiển thị khác nhau theo role)

##### [NEW] [app/page.tsx](file:///d:/VS%20Code/online_study_system/FE/src/app/page.tsx)

Landing page (hero section, features, CTA).

---

### Phase 2: Quản lý Khóa học (C2)

**Mục tiêu**: CRUD Course/Section/Lesson, tìm kiếm, file upload.

**Entities bổ sung**: `Course`, `Section`, `Lesson`

---

#### Database

##### [MODIFY] [schema.prisma](file:///d:/VS%20Code/online_study_system/BE/prisma/schema.prisma)

Thêm 3 models: `Course`, `Section`, `Lesson` + relationships với `User`.

```prisma
enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum LessonType {
  VIDEO
  READING
  QUIZ
}

model Course {
  id           String      @id @default(uuid())
  instructorId String
  title        String
  description  String
  price        Decimal     @db.Decimal(10, 2)
  level        CourseLevel
  thumbnailUrl String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  deletedAt    DateTime?

  instructor User      @relation("InstructorCourses", fields: [instructorId], references: [id])
  sections   Section[]
}

model Section {
  id        String   @id @default(uuid())
  courseId   String
  title     String
  order     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  course  Course   @relation(fields: [courseId], references: [id])
  lessons Lesson[]
}

model Lesson {
  id         String     @id @default(uuid())
  sectionId  String
  title      String
  order      Int
  duration   Int        @default(0)
  type       LessonType
  contentUrl String?
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  section Section @relation(fields: [sectionId], references: [id])
}
```

##### [NEW] [seed-courses.ts](file:///d:/VS%20Code/online_study_system/Data/seeds/seed-courses.ts)

Seed 5-10 khóa học mẫu với sections và lessons.

---

#### Backend

##### [NEW] [modules/course/](file:///d:/VS%20Code/online_study_system/BE/src/modules/course)

| File | Mô tả |
|------|--------|
| `course.routes.ts` | CRUD routes cho Course, Section, Lesson |
| `course.controller.ts` | Controllers |
| `course.service.ts` | Business logic: tạo/sửa/xóa khóa học, search & filter |
| `course.validator.ts` | Zod schemas |

##### [NEW] [modules/upload/](file:///d:/VS%20Code/online_study_system/BE/src/modules/upload)

- `upload.routes.ts` — `POST /api/upload` (multer middleware)
- `upload.service.ts` — Lưu file local, trả URL

**API Endpoints Phase 2:**

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|--------|
| GET | `/api/courses` | ❌ | Danh sách khóa học (có search, filter, pagination) |
| GET | `/api/courses/:id` | ❌ | Chi tiết khóa học (kèm sections + lessons) |
| POST | `/api/courses` | ✅ INSTRUCTOR | Tạo khóa học |
| PUT | `/api/courses/:id` | ✅ INSTRUCTOR (owner) | Cập nhật khóa học |
| DELETE | `/api/courses/:id` | ✅ INSTRUCTOR (owner) | Soft delete khóa học |
| POST | `/api/courses/:id/sections` | ✅ INSTRUCTOR | Thêm section |
| PUT | `/api/sections/:id` | ✅ INSTRUCTOR | Sửa section |
| DELETE | `/api/sections/:id` | ✅ INSTRUCTOR | Xóa section |
| POST | `/api/sections/:id/lessons` | ✅ INSTRUCTOR | Thêm lesson |
| PUT | `/api/lessons/:id` | ✅ INSTRUCTOR | Sửa lesson |
| DELETE | `/api/lessons/:id` | ✅ INSTRUCTOR | Xóa lesson |
| POST | `/api/upload` | ✅ | Upload file (video/image) |

---

#### Frontend

##### [NEW] [app/(main)/courses/](file:///d:/VS%20Code/online_study_system/FE/src/app/(main)/courses)

- `page.tsx` — Trang danh sách khóa học (grid cards, search bar, filter by level/price)
- `[id]/page.tsx` — Trang chi tiết khóa học (hero banner, curriculum accordion, instructor info, CTA đăng ký)

##### [NEW] [app/(main)/instructor/](file:///d:/VS%20Code/online_study_system/FE/src/app/(main)/instructor)

- `courses/page.tsx` — Quản lý khóa học của instructor
- `courses/new/page.tsx` — Form tạo khóa học mới (multi-step wizard)
- `courses/[id]/edit/page.tsx` — Chỉnh sửa khóa học
- `courses/[id]/content/page.tsx` — Quản lý nội dung (drag-drop sections/lessons)

##### [NEW] [components/features/](file:///d:/VS%20Code/online_study_system/FE/src/components/features)

- `CourseCard.tsx` — Card khóa học (thumbnail, title, price, rating, instructor)
- `CourseFilter.tsx` — Filter panel (level, price range, search)
- `CurriculumAccordion.tsx` — Accordion hiển thị sections/lessons
- `LessonForm.tsx` — Form thêm/sửa lesson

---

### Phase 3: Đăng ký & Thanh toán (C3)

**Mục tiêu**: Enrollment flow, Payment (mock), Coupon system.

**Entities bổ sung**: `Enrollment`, `Payment`, `Coupon`

---

#### Database

##### [MODIFY] [schema.prisma](file:///d:/VS%20Code/online_study_system/BE/prisma/schema.prisma)

Thêm 3 models (Tương thích SQLite):

```prisma
model Enrollment {
  id         String   @id @default(uuid())
  studentId  String
  courseId   String
  enrolledAt DateTime @default(now())
  status     String   @default("PENDING") // PENDING, ACTIVE, CANCELLED, COMPLETED
  updatedAt  DateTime @updatedAt

  student User   @relation(fields: [studentId], references: [id], onDelete: Cascade)
  course  Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  payment Payment?

  @@unique([studentId, courseId])
  @@map("enrollments")
}

model Payment {
  id            String    @id @default(uuid())
  enrollmentId  String    @unique
  couponId      String?
  originalPrice Float
  finalPrice    Float
  paymentMethod String    @default("CREDIT_CARD") // CREDIT_CARD, BANK_TRANSFER
  transactionId String?
  status        String    @default("PENDING") // PENDING, COMPLETED, FAILED
  paidAt        DateTime?
  createdAt     DateTime  @default(now())

  enrollment Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  coupon     Coupon?    @relation(fields: [couponId], references: [id], onDelete: SetNull)

  @@map("payments")
}

model Coupon {
  id            String   @id @default(uuid())
  code          String   @unique
  discountType  String   @default("PERCENTAGE") // PERCENTAGE, FIXED_AMOUNT
  discountValue Float
  startDate     DateTime
  endDate       DateTime
  maxUsage      Int
  currentUsage  Int      @default(0)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())

  payments Payment[]

  @@map("coupons")
}
```

> [!NOTE]
> **Quyết định (Phase 3):**
> Phần thanh toán (Payment) sẽ được thực hiện dưới dạng Mock Gateway để xem luồng hoạt động.

---

#### Backend

##### [NEW] [modules/enrollment/](file:///d:/VS%20Code/online_study_system/BE/src/modules/enrollment)

- Enrollment CRUD, check trạng thái, logic chuyển state theo State Diagram

##### [NEW] [modules/payment/](file:///d:/VS%20Code/online_study_system/BE/src/modules/payment)

- Payment processing (mock gateway), coupon validation, refund logic

**API Endpoints Phase 3:**

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|--------|
| POST | `/api/enrollments` | ✅ STUDENT | Đăng ký khóa học (kèm couponCode optional) |
| GET | `/api/enrollments/my` | ✅ | Danh sách khóa học đã đăng ký |
| GET | `/api/enrollments/:id` | ✅ | Chi tiết enrollment |
| POST | `/api/payments/:id/process` | ✅ | Xử lý thanh toán (mock) |
| POST | `/api/coupons/validate` | ✅ | Kiểm tra coupon hợp lệ |
| POST | `/api/admin/coupons` | ✅ ADMIN | Tạo coupon |
| GET | `/api/admin/coupons` | ✅ ADMIN | Danh sách coupons |
| PUT | `/api/admin/coupons/:id` | ✅ ADMIN | Cập nhật coupon |
| POST | `/api/admin/payments/:id/refund` | ✅ ADMIN | Hoàn tiền |

---

#### Frontend

##### [NEW] Enrollment Pages

- Thêm nút "Đăng ký" trong trang chi tiết khóa học
- `checkout/page.tsx` — Trang thanh toán (nhập coupon, chọn payment method, xác nhận)
- `enrollments/page.tsx` — Danh sách khóa học đã đăng ký của student

##### [NEW] Admin Coupon Management

- `admin/coupons/page.tsx` — Quản lý mã giảm giá
- `admin/payments/page.tsx` — Quản lý giao dịch thanh toán

##### [NEW] Components

- `CheckoutForm.tsx` — Form thanh toán
- `CouponInput.tsx` — Input nhập mã giảm giá + validate
- `EnrollmentCard.tsx` — Card hiển thị khóa học đã đăng ký

---

### Phase 4: Học tập & Tương tác (C4)

**Mục tiêu**: Video Player, Progress tracking, Quiz, Notes, Q&A Discussion.

**Entities bổ sung**: `Progress`, `QuizResult`, `Note`, `Discussion`

---

#### Database

##### [MODIFY] [schema.prisma](file:///d:/VS%20Code/online_study_system/BE/prisma/schema.prisma)

Thêm 4 models (Tương thích SQLite):

```prisma
model Progress {
  id           String   @id @default(uuid())
  enrollmentId String
  lessonId     String
  status       String   @default("NOT_STARTED") // NOT_STARTED, IN_PROGRESS, COMPLETED
  updatedAt    DateTime @updatedAt

  enrollment Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  lesson     Lesson     @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([enrollmentId, lessonId])
  @@map("progresses")
}

model QuizQuestion {
  id            String   @id @default(uuid())
  lessonId      String
  questionText  String
  explanation   String?
  order         Int
  createdAt     DateTime @default(now())

  lesson        Lesson        @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  choices       QuizChoice[]

  @@map("quiz_questions")
}

model QuizChoice {
  id            String   @id @default(uuid())
  questionId    String
  choiceText    String
  isCorrect     Boolean
  
  question      QuizQuestion  @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@map("quiz_choices")
}

model QuizResult {
  id          String   @id @default(uuid())
  studentId   String
  lessonId    String
  score       Float
  isPassed    Boolean
  completedAt DateTime @default(now())

  student User   @relation(fields: [studentId], references: [id], onDelete: Cascade)
  lesson  Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@map("quiz_results")
}

model Note {
  id             String   @id @default(uuid())
  studentId      String
  lessonId       String
  content        String
  videoTimestamp Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  student User   @relation(fields: [studentId], references: [id], onDelete: Cascade)
  lesson  Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@map("notes")
}

model Discussion {
  id        String    @id @default(uuid())
  userId    String
  lessonId  String
  content   String
  parentId  String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  user    User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson  Lesson       @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  parent  Discussion?  @relation("DiscussionReplies", fields: [parentId], references: [id], onDelete: SetNull)
  replies Discussion[] @relation("DiscussionReplies")

  @@map("discussions")
}
```

> [!NOTE]
> **Quyết định (Phase 4):**
> 1. **Video Player**: Hỗ trợ HTML5 Video Player đơn giản.
> 2. **Trắc nghiệm (Quiz)**: Thiết kế sẵn schema Database (gồm `QuizQuestion`, `QuizChoice`, `QuizResult`) và tạo dữ liệu mẫu (seed) chứ không dùng JSON fix cứng.

---

#### Backend

##### [NEW] [modules/learning/](file:///d:/VS%20Code/online_study_system/BE/src/modules/learning)

- Progress tracking (update per lesson, calculate course %)
- Quiz grading logic

##### [NEW] [modules/interaction/](file:///d:/VS%20Code/online_study_system/BE/src/modules/interaction)

- Notes CRUD (per student per lesson)
- Discussion CRUD (nested replies, soft delete)

**API Endpoints Phase 4:**

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|--------|
| GET | `/api/learn/:courseId` | ✅ (enrolled) | Lấy nội dung học tập (lessons + progress) |
| PUT | `/api/progress` | ✅ | Cập nhật tiến độ bài học |
| GET | `/api/progress/:enrollmentId` | ✅ | Xem tiến độ tổng khóa học |
| POST | `/api/quiz/:lessonId/submit` | ✅ | Nộp bài quiz |
| GET | `/api/quiz/:lessonId/result` | ✅ | Xem kết quả quiz |
| GET | `/api/notes/:lessonId` | ✅ | Danh sách ghi chú theo lesson |
| POST | `/api/notes` | ✅ | Tạo ghi chú |
| PUT | `/api/notes/:id` | ✅ | Sửa ghi chú |
| DELETE | `/api/notes/:id` | ✅ | Xóa ghi chú |
| GET | `/api/discussions/:lessonId` | ✅ | Danh sách thảo luận (nested) |
| POST | `/api/discussions` | ✅ | Đăng câu hỏi/trả lời |
| PUT | `/api/discussions/:id` | ✅ | Sửa bình luận |
| DELETE | `/api/discussions/:id` | ✅ | Soft delete bình luận |

---

#### Frontend

##### [NEW] [app/(main)/learn/](file:///d:/VS%20Code/online_study_system/FE/src/app/(main)/learn)

- `[courseId]/page.tsx` — **Learning Player** (layout chính):
  - Left: Video player + lesson content
  - Right sidebar: Curriculum (sections/lessons) với progress indicators
  - Bottom tabs: Notes, Q&A Discussion
  - Progress bar tổng khóa học

##### [NEW] Components

- `VideoPlayer.tsx` — HTML5 video player với controls, progress tracking
- `ProgressBar.tsx` — Circular/linear progress indicator
- `NoteEditor.tsx` — Inline note editor với timestamp link
- `DiscussionThread.tsx` — Thread Q&A lồng nhau (reply tree)
- `QuizPlayer.tsx` — Giao diện làm quiz (multiple choice)
- `LessonSidebar.tsx` — Sidebar curriculum với checkmarks

---

### Phase 5: Nâng cao & Hoàn thiện (C5)

**Mục tiêu**: Certificate, Review, Notification, Admin Dashboard, Statistics.

**Entities bổ sung**: `Certificate`, `Review`, `Notification`

---

#### Database

##### [MODIFY] [schema.prisma](file:///d:/VS%20Code/online_study_system/BE/prisma/schema.prisma)

Thêm 3 models cuối cùng:

```prisma
model Certificate {
  id              String   @id @default(uuid())
  enrollmentId    String   @unique
  certificateUrl  String?
  certificateCode String   @unique
  issuedAt        DateTime @default(now())

  enrollment Enrollment @relation(fields: [enrollmentId], references: [id])
}

model Review {
  id           String   @id @default(uuid())
  enrollmentId String   @unique
  rating       Int      // 1-5
  comment      String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  enrollment Enrollment @relation(fields: [enrollmentId], references: [id])
}

enum NotificationType {
  SYSTEM
  ANNOUNCEMENT
  ENROLLMENT
  PAYMENT
}

model Notification {
  id        String           @id @default(uuid())
  userId    String
  type      NotificationType
  title     String
  content   String
  isRead    Boolean          @default(false)
  relatedId String?
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id])
}
```

---

#### Backend

##### [NEW] [modules/notification/](file:///d:/VS%20Code/online_study_system/BE/src/modules/notification)

- CRUD notifications, mark as read, broadcast announcements

**API Endpoints Phase 5:**

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|--------|
| POST | `/api/reviews` | ✅ (enrolled) | Đăng đánh giá khóa học |
| GET | `/api/courses/:id/reviews` | ❌ | Xem đánh giá khóa học |
| GET | `/api/certificates/:enrollmentId` | ✅ | Lấy chứng chỉ |
| GET | `/api/notifications` | ✅ | Danh sách thông báo |
| PUT | `/api/notifications/:id/read` | ✅ | Đánh dấu đã đọc |
| PUT | `/api/notifications/read-all` | ✅ | Đánh dấu tất cả đã đọc |
| POST | `/api/instructor/courses/:id/announce` | ✅ INSTRUCTOR | Gửi announcement |
| GET | `/api/admin/dashboard` | ✅ ADMIN | Thống kê tổng quan |
| GET | `/api/admin/revenue` | ✅ ADMIN | Báo cáo doanh thu |
| GET | `/api/instructor/revenue` | ✅ INSTRUCTOR | Doanh thu cá nhân |

---

#### Frontend

##### [NEW] Notification System

- `NotificationDropdown.tsx` — Dropdown trong header (bell icon + badge count)
- `notifications/page.tsx` — Trang xem tất cả thông báo

##### [NEW] Review & Certificate

- `ReviewSection.tsx` — Component đánh giá trong trang chi tiết khóa học
- `ReviewForm.tsx` — Form đánh giá (star rating + comment)
- `CertificateView.tsx` — Hiển thị chứng chỉ (có thể download)

##### [NEW] Admin Dashboard

- `admin/page.tsx` — Dashboard tổng quan (cards thống kê, charts doanh thu)
- `admin/users/page.tsx` — Quản lý users (bảng, search, gán role)
- `admin/revenue/page.tsx` — Báo cáo doanh thu (charts)

##### [NEW] Instructor Dashboard

- `instructor/page.tsx` — Dashboard instructor (số khóa học, học viên, doanh thu)
- `instructor/revenue/page.tsx` — Thống kê doanh thu cá nhân

---

## Verification Plan

### Automated Tests

Mỗi Phase sẽ bao gồm:

```bash
# Backend tests
cd BE && npm test              # Unit tests (Jest)
cd BE && npm run test:e2e      # API integration tests (Supertest)

# Frontend tests
cd FE && npm run build         # Build check (no errors)
cd FE && npm run lint          # Lint check

# Database
cd BE && npx prisma validate   # Schema validation
cd BE && npx prisma migrate dev # Migration test
```

### Manual Verification

| Phase | Kiểm tra thủ công |
|-------|-------------------|
| Phase 1 | Đăng ký → Đăng nhập → Xem profile → Admin gán role |
| Phase 2 | Instructor tạo khóa học → Thêm section/lesson → Guest xem danh sách |
| Phase 3 | Student đăng ký khóa học → Nhập coupon → Thanh toán → Xác nhận enrollment |
| Phase 4 | Student xem bài học → Cập nhật tiến độ → Ghi chú → Hỏi đáp Q&A → Làm quiz |
| Phase 5 | Nhận chứng chỉ → Đánh giá khóa học → Xem thông báo → Admin xem dashboard |

### Chạy Dev Server

```bash
# Terminal 1 — Database
docker run --name elearning-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=elearning -p 5432:5432 -d postgres:15

# Terminal 2 — Backend
cd BE && npm run dev   # http://localhost:3001

# Terminal 3 — Frontend  
cd FE && npm run dev   # http://localhost:3000
```

---

## Tổng kết Timeline ước tính

| Phase | Nội dung | Ước tính |
|-------|----------|----------|
| **Phase 1** | Setup + Auth + RBAC | ~3-4 ngày |
| **Phase 2** | Course Management | ~3-4 ngày |
| **Phase 3** | Enrollment + Payment | ~3-4 ngày |
| **Phase 4** | Learning + Interaction | ~4-5 ngày |
| **Phase 5** | Certificate + Review + Notification + Dashboard | ~4-5 ngày |
| **Tổng** | | **~17-22 ngày** |
