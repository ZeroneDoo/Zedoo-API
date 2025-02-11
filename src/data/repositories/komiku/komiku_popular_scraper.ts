import * as cheerio from "cheerio";
import type { BaseScraper } from "../../../core/base_scrape.js";
import { KomikuFetcher } from "../../../services/fetcher/komiku_fetcher.js";
import { ComicType, type KomikuPopular } from "../../types/komiku.js";

export class KomikuPopularScraper implements BaseScraper {
    async scrape(): Promise<KomikuPopular[]> {
        try {
            const html = await KomikuFetcher.getPopular()

            const $ = cheerio.load(html)

            const dataList: KomikuPopular[] = $(".popconslide .bsx a")
                .map((_, e): KomikuPopular => {
                    const element = $(e)
                    const typeClass = element.find(".type").attr("class") ?? "";
                    const type = /Manhwa/.test(typeClass)
                        ? ComicType.manhwa
                        : /Manga/.test(typeClass)
                        ? ComicType.manga
                        : /Manhua/.test(typeClass)
                        ? ComicType.manhua
                        : ComicType.unknown

                    return {
                        title: element.attr("title")?.toString() ?? "",
                        image: element.find("img").attr("src")?.toString() ?? "",
                        type: type,
                        rate: Number(element.find(".numscore").text().trim()),
                        endpoint: element.attr("href")?.split("/").slice(-2, -1)[0] ?? ""
                    } 
                })
                .get()

            return dataList
        } catch (e) {
            throw e
        }
    }
}