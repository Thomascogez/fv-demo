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

    const tweet: Array<Tweet> = timelineItems.map((timelineItem) => {
        const $timelineItem = $(timelineItem);

        const authorAvatar = $timelineItem.find(".main-user-dts1>a>img").first().attr("src") ? $timelineItem.find(".main-user-dts1>a>img").first().attr("src") : "";
        const [authorName, authorHandle] = $timelineItem.find(".user-text3>a>h4").first().text().split(" ");
        const authorURL = `https://x.com/${authorName}`

        const tweetText = $timelineItem.find(".activity-descp>p").text();
        const tweetLike = $timelineItem.find(".like-comment-view>.left-comments>.like-item:nth-child(3)>span").text() ?? 0;
        const tweetDate = $timelineItem.find(".user-text3>span").text();
        const tweetURL = $timelineItem.find(".user-text3>a").attr("href") ? `https://x.com${$timelineItem.find(".tweet-link").attr("href")}` : "";

        return {
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

    return tweet;
}