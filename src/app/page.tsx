import TweetGenerator from "@/components/TweetGenerator";

export default function Home() {

  return (
    <div className="min-h-screen">
      <div className="text-center mt-16 mb-16 ">
        <h1 className="text-3xl">Share what you have learnt today with the world!</h1>
        <h1 className=" font-bold text-4xl">Generate Post now!</h1>
      </div>
      <div className="flex  items-center justify-center ">
        <TweetGenerator />
      </div>
    </div>
  );
}
