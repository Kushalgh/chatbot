import React, { useState, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "../lib/components/ui/button";
import { Input } from "../lib/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../lib/components/ui/card";
import { ScrollArea } from "../lib/components/ui/scroll-area";
import { chatService } from "../service/chat-service";

interface Message {
  type: "user" | "bot";
  message: string;
  options: string[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await chatService.startChat();
        setSessionId(response.sessionId);
        if (response?.options?.length > 0) {
          setMessages([
            {
              type: "bot",
              options: response.options,
              message: response.message,
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        addBotMessage("Failed to initialize chat. Please try again later.");
      }
    };
    initializeChat();
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!sessionId || !message?.trim()) return;

    addUserMessage(message);
    setInput("");
    try {
      const response = await chatService.sendMessage(message, sessionId);
      setMessages((prevMessages) =>
        prevMessages.map((msg) => ({
          ...msg,
          options: [],
        }))
      );
      if (response?.message) {
        addBotMessage(response);
      } else {
        addBotMessage({
          message: "Received an invalid response. Please try again.",
          options: [],
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      addBotMessage({
        message: "An error occurred. Please try again later.",
        options: [],
      });
    }
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", message: content, options: [] },
    ]);
  };

  const addBotMessage = (content: { message: string; options: string[] }) => {
    setMessages((prev) => [
      ...prev,
      { type: "bot", message: content.message, options: content.options },
    ]);
  };

  return (
    <Card className="w-[440px] h-[600px] grid grid-rows-[auto_1fr_auto] relative">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          Banking Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 ">
        <ScrollArea className="h-[calc(600px-120px)]">
          <div className="flex flex-col gap-4 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`rounded-full p-2 ${
                      message.type === "user" ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Bot className="w-4 h-4 text-secondary-foreground" />
                    )}
                  </div>
                  <div
                    className={`flex flex-col gap-2 ${
                      message.type === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.message}
                    </div>
                    {message.options.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.options.map((item, optionIndex) => (
                          <Button
                            key={optionIndex}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendMessage(item)}
                          >
                            {item}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-4  relative bottom-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex w-full gap-2"
        >
          <Input
            placeholder="Type your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
