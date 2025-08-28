declare module '@google/generative-ai' {
    export class GoogleGenerativeAI {
      constructor(apiKey: string);
      getGenerativeModel(options: { model: string }): GenerativeModel;
    }
  
    export class GenerativeModel {
      startChat(options: {
        history?: Array<{
          role: string;
          parts: Array<{ text: string }>;
        }>;
        generationConfig?: {
          maxOutputTokens?: number;
        };
      }): ChatSession;
    }
  
    export class ChatSession {
      sendMessage(message: Array<{ text: string }>): Promise<{
        response: {
          text(): string;
        };
      }>;
    }
  }