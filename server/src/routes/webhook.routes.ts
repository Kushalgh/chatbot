import { Router } from "express";
import {
  createWebhook,
  getAllWebhooks,
  updateWebhook,
  deleteWebhook,
} from "../controllers/webhook.controller";

const router = Router();

router.post("/", createWebhook);
router.get("/", getAllWebhooks);
router.put("/:id", updateWebhook);
router.delete("/:id", deleteWebhook);

export default router;
