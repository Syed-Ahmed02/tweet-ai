import { generateText } from "ai";
import { google } from "@ai-sdk/google"
import { NextResponse } from 'next/server';
export const runtime = "edge";
// import { copyWritingStyles, copyWritingStylesPrompts } from "@/lib/utils";
export async function POST(req: Request) {
  try {
    const { topic, style,target } = await req.json()
    const systemMessage = `You are a professional Social media copywritter specializing in X (formally twitter). 
    I will provide you with a subject I learnt today, as well as a style and I want you to create me a X post in order to publish. The objective of the post is to share knowledge with the world. Keep the character limit less then 280 words, I only want one single post`;

    const prompt = `Create me a post on ${topic} using a ${style} writing style. Assume the target audience is ${target} when it comes to this subject`;

    const res = await generateText({
      model: google("models/gemini-1.5-pro-latest"),
      system: systemMessage,
      prompt: prompt
    });
   
    return NextResponse.json({ text: res.text })
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

