import { Router } from 'express';
import { createAudit } from '../controllers/audit.controller';
import { getReport } from '../controllers/report.controller';
import { captureLead } from '../controllers/lead.controller';

const router = Router();

// POST /api/audit — run audit, save to DB, return shareId
router.post('/audit', createAudit);

// GET /api/report/:shareId — fetch public report
router.get('/report/:shareId', getReport);

// POST /api/lead — capture lead + send email
router.post('/lead', captureLead);

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
