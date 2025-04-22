import type { Tweet } from "./twitter";

export type TweetWithAiAnalysis = Tweet & {
    analysis: string;
}

const mockAiAnalysis = [
    "Tone Analysis: The tweet uses an enthusiastic and persuasive tone, likely aimed at promoting a product or idea.",
    "Hashtag Insight: Includes 3 hashtags, 2 of which are trending in the tweet’s category(e.g., #AI, #Startups).",
    "Virality Potential: High chance of shares due to controversial opinion and concise phrasing.",
    "Emotion Detected: Primary emotion detected is excitement, with a hint of urgency.",
    "Content Type: This is an opinion - based tweet with a call - to - action, commonly seen in marketing posts.",
]

export const analyzeTweet = async (tweet: Tweet): Promise<TweetWithAiAnalysis> => {
    const analysis = mockAiAnalysis[Math.floor(Math.random() * mockAiAnalysis.length)];
    return { ...tweet, analysis };
}