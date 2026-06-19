import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { sendSuccess, sendError } from '../../utils/response';
import { v4 as uuidv4 } from 'uuid';

export class CertificateController {
  // Lấy hoặc cấp phát chứng chỉ
  async getCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const enrollmentId = req.params.enrollmentId as string;
      const userId = req.user?.userId;

      if (!userId) return sendError(res, 'Unauthorized', 401);

      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
          course: true,
          student: { select: { fullName: true } },
          certificate: true,
          progresses: true,
        }
      });

      if (!enrollment || enrollment.studentId !== userId) {
        return sendError(res, 'Không tìm thấy thông tin đăng ký', 404);
      }

      if (enrollment.certificate) {
        return sendSuccess(res, { certificate: enrollment.certificate, course: enrollment.course, student: enrollment.student }, 'Lấy chứng chỉ thành công');
      }

      // Check completion status (100% progresses & all passed?)
      // Giả sử học viên đã đạt điều kiện hoàn thành (tạm thời bỏ qua logic check progress phức tạp)
      const isCompleted = enrollment.status === 'COMPLETED' || enrollment.progresses.length > 0;
      
      if (!isCompleted) {
        return sendError(res, 'Bạn chưa hoàn thành khóa học này', 400);
      }

      // Cấp chứng chỉ mới
      const newCertificate = await prisma.certificate.create({
        data: {
          enrollmentId,
          certificateCode: `CERT-${uuidv4().split('-')[0].toUpperCase()}`,
        }
      });

      // Cập nhật trạng thái enrollment nếu chưa COMPLETED
      if (enrollment.status !== 'COMPLETED') {
        await prisma.enrollment.update({
          where: { id: enrollmentId },
          data: { status: 'COMPLETED' }
        });
      }

      return sendSuccess(res, { certificate: newCertificate, course: enrollment.course, student: enrollment.student }, 'Đã cấp chứng chỉ mới', 201);
    } catch (error) {
      next(error);
    }
  }
}

export const certificateController = new CertificateController();
