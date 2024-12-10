import { Request, Response } from "express";
import DecisionTreeNode from "../models/decision-tree.model";
import { handleError, createError } from "../utils/error-handler";

export async function createNode(req: Request, res: Response) {
  try {
    const node = await DecisionTreeNode.create(req.body);
    res.status(201).json(node);
  } catch (error) {
    handleError(error, res);
  }
}

export async function getNode(req: Request, res: Response) {
  try {
    const node = await DecisionTreeNode.findOne({ id: req.params.id }).populate(
      "type_id"
    );
    if (!node) throw createError("Node not found", 404);
    res.json(node);
  } catch (error) {
    handleError(error, res);
  }
}

export async function updateNode(req: Request, res: Response) {
  try {
    const node = await DecisionTreeNode.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!node) throw createError("Node not found", 404);
    res.json(node);
  } catch (error) {
    handleError(error, res);
  }
}

export async function deleteNode(req: Request, res: Response) {
  try {
    const node = await DecisionTreeNode.findOneAndDelete({ id: req.params.id });
    if (!node) throw createError("Node not found", 404);
    res.json({ message: "Node deleted" });
  } catch (error) {
    handleError(error, res);
  }
}
