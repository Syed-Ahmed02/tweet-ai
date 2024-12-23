import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const body = await req.json();
  const { prompt } = body;
  const finalPrompt = `Create me an image related to the following content ---- ${prompt}`

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: finalPrompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response?.data?.[0]?.url;
    console.log('imageUrl:', imageUrl);
    
    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

