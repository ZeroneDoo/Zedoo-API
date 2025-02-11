import * as cheerio from "cheerio";
import type { BaseScraper, ScrapeParams } from "../../../core/base_scrape.js";
import { KomikuFetcher } from "../../../services/fetcher/komiku_fetcher.js";
import { ComicType, type KomikuPopular } from "../../types/komiku.js";
import type { ApiResponse } from "../../types/api_response.js";

export class KomikuSearchScraper implements BaseScraper {
    async scrape({ keyword, page }: ScrapeParams): Promise<{
        "meta" : ApiResponse['meta'],
        "data" : KomikuPopular[]
    }> {
        try {
            const html = await KomikuFetcher.getBySearch(keyword ?? "", page ?? 1)

            const $ = cheerio.load(html)

            const dataList: KomikuPopular[] = []

            $(".listupd a").each((i, e) => {
                let type: ComicType
                if($(e).find('.type').attr("class")?.includes("Manhwa")) type = ComicType.manhwa
                else if($(e).find('.type').attr("class")?.includes("Manga")) type = ComicType.manga
                else if($(e).find('.type').attr("class")?.includes("Manhua")) type = ComicType.manhua
                else type = ComicType.unknown

                const search: KomikuPopular = {
                    title: $(e).attr("title")?.toString() ?? "",
                    image: $(e).find("img").attr("src")?.toString() ?? "",
                    type: type,
                    rate: Number($(e).find(".numscore").text().trim()),
                    endpoint: $(e).attr("href")?.split("/").slice(-2, -1)[0] ?? ""
                } 

                dataList.push(search)
            })

            const parsePageData = (selector: string) => {
                const href = $(selector).attr("href");
                if (!href) return { page: 0, url: "" };

                return {
                    page: href.includes("page") ? Number(href.split("/").slice(-2, -1)[0]) : 1,
                    url: href.includes("page") ? href : `${KomikuFetcher.BASE_URL}/?s=${keyword}`
                };
            };

            const nextPage = parsePageData(".pagination .next");
            const prevPage = parsePageData(".pagination .prev");

            return {
                data: dataList,
                meta: {
                    next_page: nextPage.page,
                    next_url: nextPage.url,
                    prev_page: prevPage.page,
                    prev_url: prevPage.url,
                    total_data: dataList.length
                }
            }
        } catch (e) {
            throw e
        }
    }
}