import type { TweetWithAiAnalysis } from "@/lib/ai"
import { Heart } from "lucide-react"

type TweetCardProps = {
    tweet: TweetWithAiAnalysis
}

export const TweetCard: React.FC<TweetCardProps> = ({ tweet }) => {
    return (
        <div className="max-w-xl rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex gap-3">
                <img src={tweet.author.avatar} alt={tweet.author.name} className="h-10 w-10 rounded-full" />

                <div className="flex-1">
                    <div className="flex items-center gap-1">
                        <span className="font-semibold">{tweet.author.name}</span>
                        <span className="text-sm text-gray-500">{tweet.author.handle}</span>
                        <span className="text-sm text-gray-500">·</span>
                        <span className="text-sm text-gray-500">{tweet.date}</span>
                    </div>
                    <p className="mt-1 text-gray-800" dangerouslySetInnerHTML={{ __html: tweet.text }} />

                    <div className="mt-3 flex justify-between">
                        <div className="flex items-center gap-2">
                            <Heart className="text-red-500 mr-1 h-4 w-4 fill-current" />
                            <span>{tweet.like}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <p className="mb-1 text-xs font-medium text-gray-500">{tweet.analysis}</p>
            </div>
        </div>
    )
}