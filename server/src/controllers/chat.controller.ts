import { Request, Response } from "express";
import * as chatService from "../services/chat.service";
import { handleError } from "../utils/error-handler";

export async function startChat(req: Request, res: Response) {
  try {
    const chat = await chatService.startChat();
    res.status(201).json({
      sessionId: chat.sessionId,
      message: chat.messages[0].text,
    });
  } catch (error) {
    handleError(error, res);
  }
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const { sessionId, message } = req.body;
    const response = await chatService.processMessage(sessionId, message);
    res.json({
      sessionId,
      message: response.response,
      options: response.options,
    });
  } catch (error) {
    handleError(error, res);
  }
}
