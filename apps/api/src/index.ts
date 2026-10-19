import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { prisma } from "./db.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { profileRouter } from "./routes/profile.js";
import { syllabusRouter } from "./routes/syllabus.js";
import { libraryRouter } from "./routes/library.js";
import { planningRouter } from "./routes/planning.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { goalPlanRouter } from "./routes/goalPlan.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "gate-tracker-api" });
});

app.use("/api/profile", profileRouter);
app.use("/api", syllabusRouter);
app.use("/api", libraryRouter);
app.use("/api", planningRouter);
app.use("/api", dashboardRouter);
app.use("/api", goalPlanRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, "0.0.0.0", () => {
  console.log(`API listening on port ${config.port}`);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
