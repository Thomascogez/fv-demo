import { deduplicateArrayByProperty } from "@/utils";
import { load } from "cheerio";

export type Tweet = {
    id: string;
    date: string;
    text: string;
    url: string;
    like: string
    author: {
        handle: string;
        name: string;
        avatar: string;
        url: string;
    }
}


export type SearchTweetResponse = {
    tweets: Record<string, {
        created_at: string,
        is_retweet: boolean,
        favorite_count: number,
        quote_count: number,
        reply_count: number,
        retweet_count: number,
        bookmark_count: number,
        view_count: string,
        full_text: string
        core: {
            rest_id: string,
            is_blue_verified: boolean,
            screen_name: string,
            profile_image_url_https: string,
            name: string
        }
    }>,
    cursor?: string
}


export const cleanHandle = (handle: string) => {
    return handle.replace(/^@/, "").toLowerCase();
}

export const getAccountIdFromHandle = async (handle: string) => {
    const cleanedHandle = cleanHandle(handle);

    const response = await fetch(`https://twstalker.com/${cleanedHandle}`);

    if (!response.ok) {
        throw new Error("Invalid handle");
    }

    const page = await response.text();

    const $ = load(page);
    const twitterId = $(".add-nw-event").attr("data-query")

    return twitterId;
}

// Fallback to manual scraping when twitter user id is not available
export const scapeUserTweet = async (handle: string) => {
    const cleanedHandle = cleanHandle(handle);
    const response = await fetch(`https://twstalker.com/${cleanedHandle}`, {
        method: "GET",
        cache: "no-cache",
        keepalive: false
    });

    if (!response.ok) {
        return [];
    }

    const text = await response.text();

    const $ = load(text);
    const timelineItems = Array.from($(".main-posts").find(".activity-posts")).slice(0, 10);

    const tweets: Array<Tweet> = timelineItems.flatMap((timelineItem) => {
        const $timelineItem = $(timelineItem);

        const retweetIndicator = $timelineItem.find(".fa-retweet");

        if (retweetIndicator.length > 0) {
            return [];
        }

        const authorAvatar = $timelineItem.find(".main-user-dts1>a>img").first().attr("src") ? $timelineItem.find(".main-user-dts1>a>img").first().attr("src") : "";
        const [authorName, authorHandle] = $timelineItem.find(".user-text3>a>h4").first().text().split(" ");
        const authorURL = `https://x.com/${authorName}`

        const tweetText = $timelineItem.find(".activity-descp>p").text();
        const tweetLike = $timelineItem.find(".like-comment-view>.left-comments>.like-item:nth-child(3)>span").text() ?? 0;
        const tweetDate = $timelineItem.find(".user-text3>span").text();
        const tweetURL = $timelineItem.find(".user-text3>span>a").attr("href") ? `https://x.com${$timelineItem.find(".user-text3>span>a").attr("href")}` : "";
        const tweetId = tweetURL.split("/").at(-1) ?? "";

        return {
            id: tweetId,
            author: {
                avatar: authorAvatar ?? "",
                handle: authorHandle,
                name: authorName,
                url: authorURL,
            },
            date: tweetDate,
            text: tweetText,
            url: tweetURL,
            like: tweetLike
        }
    });

    return tweets;
}

export const getTimelineTweets = async (handle: string, options: { limit: number } = { limit: 10 }) => {
    const cleanedHandle = cleanHandle(handle);
    const accountId = await getAccountIdFromHandle(cleanedHandle);

    if (!accountId) {
        const scrappedTweets = await scapeUserTweet(handle);
        return deduplicateArrayByProperty(scrappedTweets, "id").slice(0, options.limit);
    }

    const fetchUntilDone = async (tweets: Array<Tweet> = [], params: { page: number, cursor?: string } = { page: 1 }) => {
        if (tweets.length >= options.limit) {
            return tweets;
        }

        const body = new FormData();
        body.append("data", accountId);
        body.append("action", "profile");
        body.append("page", `${params.page}`);
        body.append("cursor", params.cursor ?? "")

        const response = await fetch(`https://twstalker.com/service/api`, {
            method: "POST",
            body: body,
        });

        if (!response.ok) {
            return tweets;
        }

        const results: SearchTweetResponse = await response.json();

        if (!results.tweets || !results.cursor) {
            return tweets;
        }

        const pageTweets = Object.entries(results.tweets)
            .filter(([, tweet]) => !tweet.is_retweet)
            .map(([id, tweet]) => ({
                id,
                date: tweet.created_at,
                text: tweet.full_text,
                url: `https://twitter.com/${cleanedHandle}/status/${tweet.core.rest_id}`,
                like: tweet.favorite_count.toString(),
                author: {
                    handle: tweet.core.screen_name,
                    name: tweet.core.name,
                    avatar: tweet.core.profile_image_url_https,
                    url: `https://twitter.com/${tweet.core.screen_name}`,
                },
            }));


        return await fetchUntilDone([...tweets, ...pageTweets], { page: params.page + 1, cursor: results.cursor });
    }

    const fetchedTweets = await fetchUntilDone([], { page: 1 });

    return deduplicateArrayByProperty(fetchedTweets, "id").slice(0, options.limit);
}