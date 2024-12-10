import { v4 as uuidv4 } from "uuid";
import Chat, { IChat } from "../models/chat.model";
import DecisionTreeNode, {
  IDecisionTreeNode,
} from "../models/decision-tree.model";
import { executeWebhook } from "./webhook.service";
import { createError } from "../utils/error-handler";

export async function startChat(): Promise<IChat> {
  const rootNode = await DecisionTreeNode.findOne({ parentId: null });
  if (!rootNode) throw createError("Root node not found", 404);

  const sessionId = uuidv4();
  const chat = await Chat.create({
    sessionId,
    messages: [{ text: rootNode.text, isUser: false }],
    context: {
      currentNodeId: rootNode.id,
      tempData: {},
      attempts: 0,
    },
  });
  return chat;
}

export async function processMessage(
  sessionId: string,
  message: string
): Promise<{ response: string; options?: string[] }> {
  const chat = await Chat.findOne({ sessionId });
  if (!chat) throw createError("Chat session not found", 404);

  const currentNode = await DecisionTreeNode.findOne({
    id: chat.context.currentNodeId,
  }).populate("type_id");
  if (!currentNode) throw createError("Current node not found", 404);

  if (!chat.context.tempData) {
    chat.context.tempData = {};
  }

  let response: string;
  let nextNode: IDecisionTreeNode | null = null;

  const nodeType = (currentNode.type_id as any).type_name;

  console.log("Current Node ID:", currentNode.id);
  console.log("Current Node Type:", nodeType);
  console.log("Existing tempData:", chat.context.tempData);

  if (nodeType === "input") {
    switch (currentNode.id) {
      case "balance_inquiry_node":
        chat.context.tempData.accountName = message;
        console.log("Saved account name:", message);
        break;
      case "balance_inquiry_account_number":
        chat.context.tempData.accountNumber = message;
        console.log("Saved account number:", message);
        break;
      default:
        chat.context.tempData[currentNode.id] = message;
    }

    nextNode = await DecisionTreeNode.findOne({
      id: currentNode.childrenIds[0],
    });
    response = nextNode ? nextNode.text : "Input received.";
  } else if (nodeType === "webhook") {
    if (!currentNode.webhookUrl)
      throw createError("Webhook URL not found", 500);

    if (currentNode.id === "balance_inquiry_account_number") {
      chat.context.tempData.accountNumber = message;
      console.log("Captured account number in webhook node:", message);
    }

    if (
      !chat.context.tempData.accountName ||
      !chat.context.tempData.accountNumber
    ) {
      throw createError(
        "Incomplete account information. Please restart the process.",
        400
      );
    }

    const webhookResult = await executeWebhook(currentNode.webhookUrl, {
      accountName: chat.context.tempData.accountName,
      accountNumber: chat.context.tempData.accountNumber,
      userInput: message,
    });

    console.log("Webhook Result:", webhookResult);

    if (webhookResult.success) {
      nextNode = await DecisionTreeNode.findOne({
        id: currentNode.childrenIds[0],
      });

      response = nextNode
        ? nextNode.text.replace(
            "${balance}",
            webhookResult.data?.balance?.toString() || ""
          )
        : webhookResult.message;

      if (webhookResult.data) {
        chat.context.tempData = {
          ...chat.context.tempData,
          ...webhookResult.data,
        };
      }
    } else {
      nextNode = await DecisionTreeNode.findOne({
        id: currentNode.childrenIds[1],
      });
      response = webhookResult.message || "Invalid input. Please try again.";
    }
  } else if (nodeType === "bot_response") {
    const selectedOption = currentNode.options?.find(
      (opt) => opt.text.toLowerCase() === message.toLowerCase()
    );

    if (!selectedOption) {
      response = "Invalid option. Please choose from the available options.";
      nextNode = currentNode;
    } else {
      nextNode = await DecisionTreeNode.findOne({
        id: selectedOption.nextNodeId,
      });

      if (!nextNode) throw createError("Next node not found", 404);
      response = nextNode.text;
    }
  } else {
    throw createError("Invalid node type", 500);
  }

  if (!nextNode) throw createError("Next node not found", 404);

  chat.messages.push({ text: message, isUser: true });
  chat.messages.push({ text: response, isUser: false });

  chat.context.currentNodeId = nextNode.id;

  await chat.save();

  console.log(
    `Chat session ${sessionId} updated. Total messages: ${chat.messages.length}`
  );
  console.log("Updated tempData:", chat.context.tempData);

  const options = nextNode.options?.map((opt) => opt.text);
  return { response, options };
}
