import { Router } from "express";
import {
  createNode,
  getNode,
  updateNode,
  deleteNode,
} from "../controllers/decision-tree.controller";

const router = Router();

router.post("/", createNode);
router.get("/:id", getNode);
router.put("/:id", updateNode);
router.delete("/:id", deleteNode);

export default router;
