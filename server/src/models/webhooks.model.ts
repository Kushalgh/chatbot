import mongoose, { Document, Schema } from "mongoose";

export interface IWebhook extends Document {
  decision_tree_id: string;
  name: string;
  url: string;
  headers?: Array<{
    key: string;
    value: string;
  }>;
}

const webhookSchema = new Schema<IWebhook>({
  decision_tree_id: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  headers: [
    {
      key: String,
      value: String,
    },
  ],
});

const Webhook = mongoose.model<IWebhook>("Webhook", webhookSchema);

export default Webhook;
