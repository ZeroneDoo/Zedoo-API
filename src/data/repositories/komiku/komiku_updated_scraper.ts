import * as cheerio from "cheerio";
import type { BaseScraper, ScrapeParams } from "../../../core/base_scrape.js";
import { KomikuFetcher } from "../../../services/fetcher/komiku_fetcher.js";
import { ComicType, type KomikuUpdated } from "../../types/komiku.js";
import type { ApiResponse } from "../../types/api_response.js";

export class KomikuUpdatedScraper implements BaseScraper {
    async scrape({ page }: ScrapeParams): Promise<{
        "meta" : ApiResponse['meta'],
        "data" : KomikuUpdated[]
    }> {
        try {
            const html = await KomikuFetcher.getUpdated(page ?? 1)

            const $ = cheerio.load(html)

            const dataList: KomikuUpdated[] = $(".listupd .uta")
                .map((_, e) => {
                    const element = $(e);
                    const typeClass = element.find(".type").attr("class") ?? "";
                    const type = /Manhwa/.test(typeClass)
                        ? ComicType.manhwa
                        : /Manga/.test(typeClass)
                        ? ComicType.manga
                        : /Manhua/.test(typeClass)
                        ? ComicType.manhua
                        : ComicType.unknown

                    const latestChapter: KomikuUpdated['latest_chapter'] = element
                        .find(".luf li")
                        .map((_, e2) => ({
                            title: $(e2).find("a").text().trim() ?? "",
                            created_at: $(e2).find("span").text().trim() ?? "",
                            endpoint: $(e2).find("a").attr("href")?.split("/").slice(-2, -1)[0] ?? "",
                        }))
                        .get()
                    
                    const updated: KomikuUpdated =  {
                        id: Number(element.find("a").attr("rel")),
                        title: element.find("a").attr("title")?.toString() ?? "",
                        image: element.find("img").attr("src")?.toString() ?? "",
                        type: type,
                        endpoint: element.find("a").attr("href")?.split("/").slice(-2, -1)[0] ?? "",
                        latest_chapter: latestChapter,
                    }
                    return updated
                })
                .get();

            const parsePageNumber = (selector: string) => Number($(selector).attr("href")?.split("/").pop() ?? 0);

            return {
                data: dataList,
                meta: {
                    next_page: parsePageNumber(".hpage .r"),
                    next_url: $(".hpage .r").attr("href") ?? "",
                    prev_page: parsePageNumber(".hpage .l"),
                    prev_url: $(".hpage .l").attr("href") ?? "",
                    total_data: dataList.length,
                },
            };
        } catch (e) {
            throw e
        }
    }
}