import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const Role = { STUDENT: 'STUDENT', INSTRUCTOR: 'INSTRUCTOR', ADMIN: 'ADMIN' };
const CourseLevel = { BEGINNER: 'BEGINNER', INTERMEDIATE: 'INTERMEDIATE', ADVANCED: 'ADVANCED' };
const LessonType = { VIDEO: 'VIDEO', READING: 'READING', QUIZ: 'QUIZ' };

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.quizResult.deleteMany();
  await prisma.quizChoice.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.section.deleteMany();
  await prisma.course.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('123456', 12);

  // === Admin ===
  const admins = [];
  for (let i = 1; i <= 10; i++) {
    const admin = await prisma.user.create({
      data: {
        fullName: `Admin Hệ Thống ${i}`,
        email: `admin${i}@elearning.vn`,
        password: hashedPassword,
        roles: { create: [{ role: Role.ADMIN }] },
      },
    });
    admins.push(admin);
  }
  console.log(`✅ Created 10 admins`);

  // === Instructors ===
  const instructors = [];
  for (let i = 1; i <= 10; i++) {
    const instructor = await prisma.user.create({
      data: {
        fullName: `Giảng Viên ${i}`,
        email: `instructor${i}@elearning.vn`,
        password: hashedPassword,
        roles: { create: [{ role: Role.INSTRUCTOR }] },
      },
    });
    instructors.push(instructor);
  }
  console.log(`✅ Created 10 instructors`);

  // === Students ===
  const students = [];
  for (let i = 1; i <= 10; i++) {
    const student = await prisma.user.create({
      data: {
        fullName: `Học Viên ${i}`,
        email: `student${i}@gmail.com`,
        password: hashedPassword,
        roles: { create: [{ role: Role.STUDENT }] },
      },
    });
    students.push(student);
  }
  console.log(`✅ Created 10 students`);

  // === Courses ===
  console.log('📚 Seeding courses...');
  const courseTitles = [
    'React.js Cơ bản đến Nâng cao',
    'Khóa học Node.js & Express.js',
    'Làm chủ Next.js 14 và TypeScript',
    'Lập trình Python cho người mới bắt đầu',
    'UI/UX Design thực chiến với Figma',
    'Xây dựng ứng dụng di động với React Native'
  ];

  const createdCourses = [];
  for (let i = 0; i < 6; i++) {
    const instructor = instructors[i % instructors.length];
    const course = await prisma.course.create({
      data: {
        title: courseTitles[i],
        description: `Mô tả chi tiết cho khóa học ${courseTitles[i]}. Học từ cơ bản đến nâng cao với dự án thực tế.`,
        price: 499000 + (i * 100000), // 499k, 599k, ...
        level: i % 2 === 0 ? CourseLevel.BEGINNER : CourseLevel.INTERMEDIATE,
        instructorId: instructor.id,
        sections: {
          create: [
            {
              title: 'Phần 1: Giới thiệu chung',
              order: 1,
              lessons: {
                create: [
                  { title: '1.1 Tổng quan khóa học', order: 1, type: LessonType.VIDEO, duration: 600, contentUrl: 'https://example.com/video1' },
                  { title: '1.2 Cài đặt công cụ', order: 2, type: LessonType.VIDEO, duration: 900, contentUrl: 'https://example.com/video2' },
                  { title: '1.3 Bài tập trắc nghiệm', order: 3, type: LessonType.QUIZ },
                ],
              },
            },
            {
              title: 'Phần 2: Kiến thức cốt lõi',
              order: 2,
              lessons: {
                create: [
                  { title: '2.1 Các khái niệm cơ bản', order: 1, type: LessonType.VIDEO, duration: 1200, contentUrl: 'https://example.com/video3' },
                  { title: '2.2 Thực hành phần 1', order: 2, type: LessonType.READING, contentUrl: 'Bài tập thực hành...' },
                ],
              },
            },
          ],
        },
      },
      include: {
        sections: {
          include: { lessons: true }
        }
      }
    });
    createdCourses.push(course);
  }
  console.log(`✅ Created 6 courses`);

  // === Quizzes ===
  console.log('📝 Seeding quizzes...');
  for (const course of createdCourses) {
    const section1 = course.sections.find(s => s.order === 1);
    if (section1) {
      const quizLesson = section1.lessons.find(l => l.type === LessonType.QUIZ);
      if (quizLesson) {
        await prisma.quizQuestion.create({
          data: {
            lessonId: quizLesson.id,
            questionText: `Câu hỏi 1 cho khóa học ${course.title}?`,
            explanation: 'Giải thích chi tiết cho câu hỏi 1.',
            order: 1,
            choices: {
              create: [
                { choiceText: 'Lựa chọn A', isCorrect: false },
                { choiceText: 'Lựa chọn B (Đúng)', isCorrect: true },
                { choiceText: 'Lựa chọn C', isCorrect: false },
              ]
            }
          }
        });

        await prisma.quizQuestion.create({
          data: {
            lessonId: quizLesson.id,
            questionText: `Câu hỏi 2 cho khóa học ${course.title}?`,
            explanation: 'Giải thích chi tiết cho câu hỏi 2.',
            order: 2,
            choices: {
              create: [
                { choiceText: 'Lựa chọn đúng', isCorrect: true },
                { choiceText: 'Lựa chọn sai 1', isCorrect: false },
                { choiceText: 'Lựa chọn sai 2', isCorrect: false },
              ]
            }
          }
        });
      }
    }
  }
  console.log(`✅ Created quizzes for all courses`);

  // === Coupons ===
  console.log('🎫 Seeding coupons...');
  await prisma.coupon.create({
    data: {
      code: 'WELCOME2026',
      discountType: 'PERCENTAGE',
      discountValue: 20, // 20%
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      maxUsage: 100,
    }
  });
  await prisma.coupon.create({
    data: {
      code: 'GIAM50K',
      discountType: 'FIXED_AMOUNT',
      discountValue: 50000, // 50,000 VND
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      maxUsage: 100,
    }
  });
  console.log(`✅ Created mock coupons: WELCOME2026 (20%), GIAM50K (50k)`);

  console.log('');
  console.log('🎉 Seed completed!');
  console.log('');
  console.log('📋 Login credentials (password: 123456):');
  console.log('   Admin:      admin1@elearning.vn');
  console.log('   Instructor: instructor1@elearning.vn');
  console.log('   Student:    student1@gmail.com');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
