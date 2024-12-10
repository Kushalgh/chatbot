import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.routes";
import decisionTreeRoutes from "./routes/decision-tree.routes";
import typeRoutes from "./routes/type.routes";
import webhookRoutes from "./routes/webhook.routes";
import accountValidationRoutes from "./webhooks/accountValidation";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/decision-tree", decisionTreeRoutes);
app.use("/api/types", typeRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api", accountValidationRoutes);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
