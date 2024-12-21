import { generateText } from "ai";
import { google } from "@ai-sdk/google"
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    console.log("Testing from api route")
    // const { transcript } = await req.json()
    // const systemMessage = "You are a professional blogger. You write simple and concise summaries on kutbahs in the following format. First with a short 200 word summary of the outlined material, then a few key takeways followed by action items";


    // const res = await generateText({
    //   model: google("models/gemini-1.5-pro-latest"),
    //   system: systemMessage,
    //   prompt: transcript,
    //   temperature: 0.5,
    // });
     return new Response();
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