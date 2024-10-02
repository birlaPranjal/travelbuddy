import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyCeTU57XCzSh5ik4sJV4yPf-Pe9u7qgSpA');

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return Response.json(
        { error: 'Prompt is required' }, 
        { status: 400 }
      );
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create chat with strong travel focus
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are Gantavya AI, a specialized travel assistant. You must strictly focus on travel and tourism topics. Your responses should always relate to destinations, travel tips, tourist attractions, or travel-related information. If asked about non-travel topics, politely redirect the conversation back to travel. Use an enthusiastic, friendly tone." }],
        },
        {
          role: "model",
          parts: [{ text: "I am Gantavya AI, your dedicated travel companion! I specialize in helping you discover amazing destinations and plan unforgettable journeys. From hidden gems to popular landmarks, I'm here to guide you through the world of travel. What kind of destination would you like to explore?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.9,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage([{ text: prompt }]);
    const response = await result.response;
    const responseText = response.text();
    
    return Response.json({ text: responseText });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return Response.json(
      { 
        error: 'Failed to fetch AI response', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}