import { Request, Response } from "express";
import Webhook from "../models/webhooks.model";
import { handleError, createError } from "../utils/error-handler";

export async function createWebhook(req: Request, res: Response) {
  try {
    const webhook = await Webhook.create(req.body);
    res.status(201).json(webhook);
  } catch (error) {
    handleError(error, res);
  }
}

export async function getAllWebhooks(req: Request, res: Response) {
  try {
    const webhooks = await Webhook.find();
    res.json(webhooks);
  } catch (error) {
    handleError(error, res);
  }
}

export async function updateWebhook(req: Request, res: Response) {
  try {
    const webhook = await Webhook.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!webhook) throw createError("Webhook not found", 404);
    res.json(webhook);
  } catch (error) {
    handleError(error, res);
  }
}

export async function deleteWebhook(req: Request, res: Response) {
  try {
    const webhook = await Webhook.findByIdAndDelete(req.params.id);
    if (!webhook) throw createError("Webhook not found", 404);
    res.json({ message: "Webhook deleted" });
  } catch (error) {
    handleError(error, res);
  }
}
