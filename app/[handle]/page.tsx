
import { TweetCard } from "@/components/tweet-card";
import { type TweetWithAiAnalysis } from "@/lib/ai";

export default async function HandlePage(props: { params: Promise<{ handle: string }> }) {
    const { handle } = await props.params;

    const endpoint = new URL(process.env.VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000");
    endpoint.pathname = `/api/analyze-profile/${handle}`;

    const response = await fetch(`api/analyze-profile/${handle}`, {
        method: "POST",
    })

    const tweetsWithAiAnalysis: TweetWithAiAnalysis[] = await response.json();


    return (
        <main className="flex justify-center items-center p-8">
            <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xl">
                <h1 className="text-4xl font-bold">
                    {handle}
                </h1>
                <p className="text-lg">
                    Showing latest tweets from {handle}
                </p>
                <div className="flex flex-col gap-4">
                    {tweetsWithAiAnalysis.map((tweet, index) => <TweetCard key={`${tweet.date}-${index}`} tweet={tweet} />)}
                </div>
            </div>
        </main>
    );
}