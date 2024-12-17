import axios from "axios";
import { NodeResponse } from "../types/chat";

const API_BASE_URL = "http://localhost:3000/api";

export const chatService = {
  async startChat(): Promise<{ sessionId: string; node: NodeResponse }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/start`);
      console.log("Chat started successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error starting chat:", error);
      throw error;
    }
  },

  async sendMessage(
    message: string,
    sessionId: string
  ): Promise<{ node: NodeResponse }> {
    console.log(`Sending message for session ${sessionId}:`, message);
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/message`, {
        message,
        sessionId,
      });
      console.log("Message sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  async validateAccount(
    accountName: string,
    accountNumber: string
  ): Promise<{ success: boolean }> {
    console.log("Validating account:", accountName, accountNumber);
    try {
      const response = await axios.post(`${API_BASE_URL}/validate-account`, {
        accountName,
        accountNumber,
      });
      console.log("Account validated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error validating account:", error);
      throw error;
    }
  },
};
