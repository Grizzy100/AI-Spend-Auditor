import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { runAudit } from "../services/audit.service";
import { generateAISummary } from "../services/gemini.service";

const AuditInputSchema = z.object({
  tools: z
    .array(
      z.object({
        toolName: z.string().min(1),
        plan: z.string().min(1),
        seats: z.number().int().min(1).max(10000),
        monthlySpend: z.number().min(0).max(1000000),
      })
    )
    .min(1, "At least one tool is required")
    .max(20, "Maximum 20 tools allowed"),
  teamSize: z.number().int().min(1).max(100000),
  primaryUseCase: z.enum(["coding", "writing", "research", "data-analysis", "mixed"]),
});

export const createAudit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = AuditInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const input = parsed.data;
    const auditResult = runAudit(input);
    const aiSummary = await generateAISummary(auditResult);

    const report = await prisma.auditReport.create({
      data: {
        shareId: auditResult.shareId,
        tools: auditResult.tools as object[],
        teamSize: auditResult.teamSize,
        primaryUseCase: auditResult.primaryUseCase,
        totalMonthlySpend: auditResult.totalMonthlySpend,
        totalMonthlySavings: auditResult.totalMonthlySavings,
        totalAnnualSavings: auditResult.totalAnnualSavings,
        wastePercentage: auditResult.wastePercentage,
        optimizationScore: auditResult.optimizationScore,
        benchmarkPercentile: auditResult.benchmarkPercentile,
        biggestInefficiency: auditResult.biggestInefficiency,
        aiSummary,
        recommendations: auditResult.recommendations as object[],
        benchmarkData: auditResult.benchmarkData as object,
      },
    });

    res.status(201).json({
      success: true,
      shareId: report.shareId,
      reportId: report.id,
    });
  } catch (error) {
    next(error);
  }
};
