import { processTravelQuery, isTravelRelated } from '@/app/lib/nlp/travelNLP';

interface RequestBody {
  prompt: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { prompt }: RequestBody = await req.json();
    
    if (!prompt || prompt.trim().length === 0) {
      return Response.json(
        { error: 'Prompt is required' }, 
        { status: 400 }
      );
    }

    // Check if query is travel-related
    if (!isTravelRelated(prompt)) {
      return Response.json({
        text: "I'm Gantavya AI, your specialized travel companion for India! 🇮🇳\n\nI focus exclusively on helping you explore India - destinations, travel tips, cuisine, culture, and itineraries.\n\nCould you ask me something about traveling in India? I'd love to help you plan your journey! ✈️"
      });
    }

    // Process query using custom NLP model
    const responseText = processTravelQuery(prompt);
    
    return Response.json({ text: responseText });
  } catch (error: unknown) {
    console.error('NLP Processing Error:', error);
    
    if (error instanceof Error) {
      return Response.json(
        { 
          error: 'Failed to process travel query', 
          details: error.message 
        }, 
        { status: 500 }
      );
    }
    return Response.json(
      { 
        error: 'Failed to process travel query', 
        details: 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}