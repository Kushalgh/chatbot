export interface ChatMessage {
  type: "user" | "bot";
  content: string;
  options?: {
    text: string;
    nextNodeId: string;
    response: string;
  }[];
}

export interface NodeResponse {
  message: string;
  options?: {
    text: string;
    nextNodeId: string;
    response: string;
  }[];
  type_id?: string;
  isLeaf?: boolean;
  webhookUrl?: string;
}
