
import { TweetCard } from "@/components/tweet-card";
import { getTimelineTweets } from "@/lib/twitter";
import { analyzeTweet } from "@/lib/ai";

export default async function HandlePage(props: { params: Promise<{ handle: string }> }) {
    const { handle } = await props.params;

    const tweets = await getTimelineTweets(handle)

    const tweetsWithAiAnalysis = await Promise.all(tweets.map(analyzeTweet));

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