import React from "react";

interface ChatMessageProps {
  message: {
    text: string;
    isUser: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { text, isUser } = message;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
          isUser ? "bg-blue-500 text-white" : "bg-white"
        }`}
      >
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
