import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const getReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const shareId = req.params.shareId as string;

    const report = await prisma.auditReport.findUnique({
      where: { shareId },
      select: {
        id: true,
        shareId: true,
        createdAt: true,
        tools: true,
        teamSize: true,
        primaryUseCase: true,
        totalMonthlySpend: true,
        totalMonthlySavings: true,
        totalAnnualSavings: true,
        wastePercentage: true,
        optimizationScore: true,
        benchmarkPercentile: true,
        biggestInefficiency: true,
        aiSummary: true,
        recommendations: true,
        benchmarkData: true,
        // Intentionally excluding leads — no email/company exposure on public URL
      },
    });

    if (!report) {
      res.status(404).json({ error: "Report not found" });
      return;
    }

    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};
