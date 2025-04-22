import { load } from "cheerio";

export type Tweet = {
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



export const cleanHandle = (handle: string) => {
    return handle.replace(/^@/, "");
}

export const getTimelineTweets = async (handle: string) => {
    const cleanedHandle = cleanHandle(handle);
    const response = await fetch(`https://nitter.net/${cleanedHandle}`, {
        method: "GET",
        cache: "no-cache",
        keepalive: false
    });

    if (!response.ok) {
        return [];
    }

    const text = await response.text();

    const $ = load(text);
    const timelineItems = Array.from($(".timeline-container").find(".timeline-item")).slice(0, 10);

    const tweet: Array<Tweet> = timelineItems.map((timelineItem) => {
        const $timelineItem = $(timelineItem);

        const authorAvatar = $timelineItem.find(".avatar").first().attr("src") ? `https://nitter.net${$timelineItem.find(".avatar").attr("src")}` : "";
        const authorHandle = $timelineItem.find(".username").first().text();
        const authorName = $timelineItem.find(".fullname").first().text();
        const authorURL = `https://x.com/${authorName}`

        const tweetText = $timelineItem.find(".tweet-content").text();
        const tweetLike = $timelineItem.find(".tweet-stats>span:nth-child(4)").text() ?? 0;
        const tweetDate = $timelineItem.find(".tweet-date").text();
        const tweetURL = $timelineItem.find(".tweet-link").attr("href") ? `https://x.com${$timelineItem.find(".tweet-link").attr("href")}` : "";

        return {
            author: {
                avatar: authorAvatar,
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

    return tweet;
}