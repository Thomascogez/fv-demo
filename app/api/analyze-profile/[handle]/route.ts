import { analyzeTweet } from "@/lib/ai";
import { getTimelineTweets } from "@/lib/twitter";
import { z } from "zod";

const analyzeProfileParamsSchema = z.object({
    handle: z.string().min(1),
})

export async function POST(_: Request, options: { params: Promise<{ handle: string }> }) {
    const { data: params, success, error } = analyzeProfileParamsSchema.safeParse(await options.params);

    if (!success) {
        return new Response(JSON.stringify({ error: error.flatten() }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        })
    }

    const timelineTweets = await getTimelineTweets(params.handle)

    if (!timelineTweets) {
        return new Response(JSON.stringify({ error: "No tweets found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        })
    }

    const analyzedTweets = await Promise.all(timelineTweets.map(analyzeTweet));

    return new Response(JSON.stringify(analyzedTweets), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    })

}