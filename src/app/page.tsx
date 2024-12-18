import TweetGenerator from "@/components/TweetGenerator";

export default function Home() {

  return (
    <div className="min-h-screen">
      <div className="text-center mt-16 mb-16 ">
        <h1 className="text-3xl">Create Viral Tweets for your company with a</h1>
        <h1 className=" font-bold text-4xl">click of a button</h1>
      </div>
      <div className="flex  items-center justify-center ">
        <div className="w-96 rounded-md shadow-lg p-4 border border-black">
          <TweetGenerator />
        </div >
      </div>
    </div>
  );
}
