
import { redirect } from "next/navigation";

import { TweetCard } from "@/components/tweet-card";
import { type TweetWithAiAnalysis } from "@/lib/ai";

export default async function HandlePage(props: { params: Promise<{ handle: string }> }) {
    const { handle } = await props.params;

    const decodedHandle = decodeURIComponent(handle);

    const endpoint = new URL(process.env.VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
    endpoint.pathname = `/api/analyze-profile/${decodedHandle}`;

    const response = await fetch(endpoint, {
        method: "POST",
    })

    if (!response.ok) {
        return redirect("/")
    }

    const tweetsWithAiAnalysis: TweetWithAiAnalysis[] = await response.json();

    return (
        <main className="flex justify-center items-center p-8">
            <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xl">
                <h1 className="text-4xl font-bold">
                    {decodedHandle}
                </h1>
                <p className="text-lg">
                    Showing latest tweets from {decodedHandle}
                </p>
                <div className="flex flex-col gap-4">
                    {tweetsWithAiAnalysis.map((tweet, index) => <TweetCard key={`${tweet.date}-${index}`} tweet={tweet} />)}
                </div>
            </div>
        </main>
    );
}