import axios from "axios";

const API_URL = "http://localhost:3001/api";

export const startChat = async () => {
  const response = await axios.post(`${API_URL}/chat/start`);
  return response.data;
};

export const sendMessage = async (sessionId: string, message: string) => {
  const response = await axios.post(`${API_URL}/chat/message`, {
    sessionId,
    message,
  });
  return response.data;
};
