// src/lib/mockAssistant.ts

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export const mockChatHistory: ChatMessage[] = [
  { id: "1", text: "Hello! How can I help you with your market analysis today?", isUser: false, timestamp: "10:00 AM" },
  { id: "2", text: "What are the key resistance levels for NASDAQ today?", isUser: true, timestamp: "10:01 AM" },
  { id: "3", text: "Based on today's pre-market data, the key resistance levels for the NASDAQ Composite are:\n\nR1: 15,950\nR2: 16,100 (major psychological level)\nR3: 16,225", isUser: false, timestamp: "10:02 AM" },
  { id: "4", text: "Would you like me to set up an alert if any of these levels are breached?", isUser: false, timestamp: "10:02 AM" },
];
