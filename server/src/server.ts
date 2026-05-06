import { prisma } from "./lib/prisma";
import app from "./app";
import { env } from "./config/env";

const start = async () => {
  try {
    // Verify database connection via Prisma v7 adapter
    await prisma.$connect();
    console.log("✅ Connected to Neon PostgreSQL");

    const PORT = parseInt(env.PORT, 10);
    app.listen(PORT, () => {
      console.log(`🚀 AI Spend Auditor API → http://localhost:${PORT}`);
      console.log(`📊 Environment: ${env.NODE_ENV}`);
      console.log(`🤖 Gemini AI: ${env.GEMINI_API_KEY ? "configured" : "fallback mode"}`);
      console.log(`📧 Resend Email: ${env.RESEND_API_KEY ? "configured" : "lead-only mode"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();
