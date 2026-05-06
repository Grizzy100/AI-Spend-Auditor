import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { sendAuditEmail } from "../services/email.service";
import { env } from "../config/env";

const LeadInputSchema = z.object({
  email: z.string().email("Invalid email address"),
  companyName: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  shareId: z.string().min(1, "shareId is required"),
});

export const captureLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = LeadInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, companyName, role, shareId } = parsed.data;

    const report = await prisma.auditReport.findUnique({
      where: { shareId },
    });

    if (!report) {
      res.status(404).json({ error: "Audit report not found" });
      return;
    }

    // Idempotent — prevent duplicate leads on the same report
    const existing = await prisma.lead.findFirst({
      where: { email, auditReportId: report.id },
    });

    if (existing) {
      res.json({ success: true, message: "Lead already captured" });
      return;
    }

    await prisma.lead.create({
      data: { email, companyName, role, auditReportId: report.id },
    });

    // Fire-and-forget email — lead save always succeeds even if email fails
    const reportUrl = `${env.FRONTEND_URL}/report/${shareId}`;
    sendAuditEmail({
      to: email,
      companyName,
      reportUrl,
      totalAnnualSavings: report.totalAnnualSavings,
      optimizationScore: report.optimizationScore,
      biggestInefficiency: report.biggestInefficiency,
      shareId,
    }).catch((err) => console.error("[Lead] Email send failed silently:", err));

    res.status(201).json({ success: true, message: "Lead captured successfully" });
  } catch (error) {
    next(error);
  }
};
