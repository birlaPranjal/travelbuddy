import OpenAI from 'openai';

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RequestBody {
  prompt: string;
}


export async function POST(req: Request): Promise<Response> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { prompt }: RequestBody = await req.json();
    
    if (!prompt || prompt.trim().length === 0) {
      return Response.json(
        { error: 'Prompt is required' }, 
        { status: 400 }
      );
    }


    // Create completion with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Gantavya AI, a specialized travel assistant focused on Indian travel and tourism. You must strictly focus on travel and tourism topics about India. Your responses should always relate to Indian destinations, travel tips, tourist attractions, or India-specific travel information. If asked about non-travel topics, politely redirect the conversation back to travel in India. Use an enthusiastic, friendly tone and make responses concise but informative. Include emojis occasionally to add personality."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0].message.content || "I'm not sure how to respond to that. Could you ask about travel in India?";
    
    return Response.json({ text: responseText });
  }
   catch (error: unknown) {
    console.error('OpenAI API Error:', error);
    
    if (error instanceof Error) {
      return Response.json(
        { 
          error: 'Failed to fetch AI response', 
          details: error.message 
        }, 
        { status: 500 }
      );
    }
    return Response.json(
      { 
        error: 'Failed to fetch AI response', 
        details: 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}