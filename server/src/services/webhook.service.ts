import axios from "axios";
import Webhook from "../models/webhooks.model";
import { createError } from "../utils/error-handler";

export async function executeWebhook(
  webhookUrl: string,
  data: Record<string, any>
) {
  console.log("Data sent to webhook:", data);

  const webhook = await Webhook.findOne({ url: webhookUrl });
  if (!webhook)
    throw createError(`Webhook not found for URL: ${webhookUrl}`, 404);

  try {
    const config: any = {};

    if (webhook.headers && webhook.headers.length > 0) {
      config.headers = webhook.headers.reduce(
        (acc, header) => ({
          ...acc,
          [header.key]: header.value,
        }),
        {}
      );
    }

    if (!data.accountName || !data.accountNumber) {
      throw createError("Account details missing in webhook data.", 400);
    }

    const response = await axios.post(webhook.url, data, config);

    console.log("Webhook response:", response.data);

    return {
      success: true,
      message: response.data.message || "Webhook executed successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("Webhook execution failed:", error);
    return {
      success: false,
      message: "Webhook execution failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
