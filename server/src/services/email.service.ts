import { Resend } from 'resend';
import { env } from '../config/env';

interface EmailPayload {
  to: string;
  companyName?: string;
  role?: string;
  reportUrl: string;
  totalAnnualSavings: number;
  optimizationScore: number;
  biggestInefficiency: string;
  shareId: string;
}

const buildEmailHtml = (payload: EmailPayload): string => {
  const { companyName, reportUrl, totalAnnualSavings, optimizationScore, biggestInefficiency } = payload;
  const greeting = companyName ? `Hi ${companyName} team` : 'Hi there';
  const savingsText = totalAnnualSavings > 0
    ? `$${totalAnnualSavings.toLocaleString()}/year in potential savings`
    : 'a well-optimized AI stack';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111118;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Credex AI Spend Auditor</p>
            <h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;">Your Audit Report Is Ready</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="color:#e2e8f0;font-size:16px;margin:0 0 24px;">${greeting},</p>
            <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 32px;">
              We've completed your AI spend audit. Here's your personalized summary:
            </p>
            <!-- Stats -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td width="48%" style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:20px;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#6366f1;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Annual Savings</p>
                  <p style="margin:0;font-size:28px;font-weight:700;color:#10b981;">$${totalAnnualSavings.toLocaleString()}</p>
                </td>
                <td width="4%"></td>
                <td width="48%" style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:12px;padding:20px;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#8b5cf6;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Efficiency Score</p>
                  <p style="margin:0;font-size:28px;font-weight:700;color:#fff;">${optimizationScore}<span style="font-size:16px;color:#64748b;">/100</span></p>
                </td>
              </tr>
            </table>
            <!-- Biggest Issue -->
            <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:20px;margin-bottom:32px;">
              <p style="margin:0;font-size:12px;color:#ef4444;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">⚡ Biggest Inefficiency</p>
              <p style="margin:0;color:#e2e8f0;font-size:15px;">${biggestInefficiency}</p>
            </div>
            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td align="center">
                  <a href="${reportUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:16px 40px;border-radius:8px;font-weight:600;font-size:16px;">
                    View Full Report →
                  </a>
                </td>
              </tr>
            </table>
            ${totalAnnualSavings > 500 ? `
            <!-- Credex CTA -->
            <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:24px;text-align:center;">
              <p style="margin:0 0 8px;font-size:14px;color:#6366f1;font-weight:600;">💡 You qualify for a Credex optimization consultation</p>
              <p style="margin:0;color:#94a3b8;font-size:14px;">With ${savingsText} identified, our team can help you implement these changes and uncover additional savings.</p>
            </div>` : ''}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="border-top:1px solid rgba(255,255,255,0.06);padding:24px 40px;text-align:center;">
            <p style="margin:0;color:#475569;font-size:13px;">Sent by <strong style="color:#6366f1;">Credex</strong> · AI Infrastructure Optimization</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

export const sendAuditEmail = async (payload: EmailPayload): Promise<boolean> => {
  if (!env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not configured — skipping email send');
    return false;
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL ?? 'audit@credex.ai',
      to: payload.to,
      subject: `Your AI Spend Audit — $${payload.totalAnnualSavings.toLocaleString()}/year in savings identified`,
      html: buildEmailHtml(payload),
    });

    if (error) {
      console.error('[Email] Resend error:', error);
      return false;
    }

    console.log(`[Email] Sent to ${payload.to}`);
    return true;
  } catch (error) {
    console.error('[Email] Unexpected error:', error);
    return false;
  }
};
