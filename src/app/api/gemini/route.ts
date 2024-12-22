import { generateText } from "ai";
import { google } from "@ai-sdk/google"
export const runtime = "edge";
// import { copyWritingStyles, copyWritingStylesPrompts } from "@/lib/utils";
export async function POST(req: Request) {
  try {
    const { topic, style } = await req.json()
    const systemMessage = `You are a professional Social media copywritter specializing in X (formally twitter). 
    I will provide you with a subject I learnt today, as well as a style and I want you to create me a X post in order to publish. The objective of the post is to share knowledge with the world. Keep the character limit less then 280 words`;

    // if (!copyWritingStyles.includes(style)) {
    //   return new Response(JSON.stringify({ error: "Invalid style provided" }), {
    //     status: 400,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }
    const prompt = `Create me a post on ${topic} using a ${style} writing style. `;

    const res = await generateText({
      model: google("models/gemini-1.5-pro-latest"),
      system: systemMessage,
      prompt: prompt
    });
    return new Response(JSON.stringify({ text: res.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// const { handleSubmit, handleInputChange } = useChat({
//     api: 'api/gemini',
//     onFinish: (message) => {
//         setError('');
//         let generatedTweetContent = message.content;
//         //Gets rid of #'s at the end of tweet
//         generatedTweetContent = generatedTweetContent.replace(/#[\w]+/g, '');
//         setGeneratedTweet(generatedTweetContent);
//     },
//     onError: (error) => {

//         setError(`The following error occured ${error}`);
//         setLoading(false);
//     }
// })