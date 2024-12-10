import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, User } from "lucide-react";
import ChatMessage from "./components/ChatMessage";
import OptionButton from "./components/OptionButton";
import { startChat, sendMessage } from "./services/api";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { log } from "console";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  text: string;
  isUser: boolean;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const response = await startChat();
        setSessionId(response.sessionId);
        setMessages([{ text: response.message, isUser: false }]);
        setLoading(false);
      } catch (error) {
        console.error("Failed to start chat:", error);
        setLoading(false);
      }
    };

    initChat();
  }, []);

  const handleOptionClick = async (option: string) => {
    if (!sessionId) return;

    setMessages((prev) => [...prev, { text: option, isUser: true }]);
    setOptions([]);
    setLoading(true);

    try {
      const response = await sendMessage(sessionId, option);
      setMessages((prev) => [
        ...prev,
        { text: response.message, isUser: false },
      ]);
      setOptions(response.options || []);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "m" && inputRef?.current) {
        event.preventDefault(); // Prevent default behavior if needed
        inputRef?.current?.focus();

        console.log("here");
      }
    };

    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, [inputRef]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4 md:p-6">
      <Card className="mx-auto max-w-4xl h-[80vh] flex flex-col shadow-xl">
        <CardHeader className="border-b bg-primary px-6">
          <CardTitle className="flex items-center gap-2 text-primary-foreground">
            <Bot className="h-6 w-6" />
            AI Chatbot Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !loading && (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>Start your conversation with the AI assistant</p>
                </div>
              )}
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  icon={
                    message.isUser ? (
                      <User className="h-6 w-6" />
                    ) : (
                      <Bot className="h-6 w-6" />
                    )
                  }
                />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              )}
            </div>
            <div className="border-t bg-muted/50  p-4">
              <div className="flex flex-wrap justify-center gap-2">
                {options.map((option, index) => (
                  <OptionButton
                    key={index}
                    text={option}
                    onClick={() => handleOptionClick(option)}
                  />
                ))}
                {options.length === 0 && !loading && messages.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Waiting for AI response...
                  </p>
                )}
              </div>
            </div>
            <div className="relative  flex items-center  border-gray-300 border-t-[1px]">
              <input
                ref={inputRef}
                placeholder="Write a message (CTRL + M)"
                className=" placeholder:pl-2 px-1 w-full h-10 bg-transparent focus:outline-none focus:border-t-[1px] border-gray-400"
                name="hero"
              />

              <div className="absolute right-2 top-0 h-full flex items-center ">
                <Send
                  className="text-blue-400 cursor-pointer hover:scale-105"
                  size={18}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
