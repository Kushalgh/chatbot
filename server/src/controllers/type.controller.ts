import { Request, Response } from "express";
import Type from "../models/type.model";
import { handleError, createError } from "../utils/error-handler";

export async function createType(req: Request, res: Response) {
  try {
    const type = await Type.create(req.body);
    res.status(201).json(type);
  } catch (error) {
    handleError(error, res);
  }
}

export async function getAllTypes(req: Request, res: Response) {
  try {
    const types = await Type.find();
    res.json(types);
  } catch (error) {
    handleError(error, res);
  }
}

export async function updateType(req: Request, res: Response) {
  try {
    const type = await Type.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
    });
    if (!type) throw createError("Type not found", 404);
    res.json(type);
  } catch (error) {
    handleError(error, res);
  }
}

export async function deleteType(req: Request, res: Response) {
  try {
    const type = await Type.findOneAndDelete({ id: req.params.id });
    if (!type) throw createError("Type not found", 404);
    res.json({ message: "Type deleted" });
  } catch (error) {
    handleError(error, res);
  }
}
