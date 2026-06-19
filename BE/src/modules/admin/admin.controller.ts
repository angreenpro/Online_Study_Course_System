import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../utils/response';

export class AdminController {
  // Lấy thống kê tổng quan cho Dashboard
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const totalUsers = await prisma.user.count();
      const totalCourses = await prisma.course.count();
      const totalEnrollments = await prisma.enrollment.count({ where: { status: 'ACTIVE' } });
      const totalRevenueResult = await prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { finalPrice: true }
      });
      
      const totalRevenue = totalRevenueResult._sum.finalPrice || 0;

      return sendSuccess(res, {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalRevenue
      }, 'Lấy thống kê thành công');
    } catch (error) {
      next(error);
    }
  }

  // Báo cáo doanh thu chi tiết (có thể truyền thêm tham số date range)
  async getRevenueReport(req: Request, res: Response, next: NextFunction) {
    try {
      // Giả lập report group by month
      const payments = await prisma.payment.findMany({
        where: { status: 'COMPLETED' },
        select: { finalPrice: true, createdAt: true },
        orderBy: { createdAt: 'asc' }
      });

      const report: Record<string, number> = {};

      for (const p of payments) {
        const monthYear = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, '0')}`;
        if (!report[monthYear]) {
          report[monthYear] = 0;
        }
        report[monthYear] += p.finalPrice;
      }

      const formattedReport = Object.keys(report).map(key => ({
        month: key,
        revenue: report[key]
      }));

      return sendSuccess(res, formattedReport, 'Lấy báo cáo doanh thu thành công');
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
