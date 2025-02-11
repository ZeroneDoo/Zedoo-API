import * as cheerio from "cheerio"
import type { BaseScraper, ScrapeParams } from "../../../core/base_scrape.js"
import { KomikuFetcher } from "../../../services/fetcher/komiku_fetcher.js"
import { ComicType, StatusType, type KomikuDetail, type KomikuPopular } from "../../types/komiku.js"

export class KomikuDetailScraper implements BaseScraper {
    async scrape({ endpoint }: ScrapeParams): Promise<KomikuDetail> {
        try {
            const html = await KomikuFetcher.getDetail(endpoint ?? "")

            const $ = cheerio.load(html)

            const element = $("#content")

            const statusText = $(element.find(".infotable tr")[0]).find("td").last().text()
            const status = /Ongoing/.test(statusText)
                ? StatusType.ongoing
                : /Completed/.test(statusText)
                ? StatusType.completed
                : /Hiatus/.test(statusText)
                ? StatusType.hiatus
                : StatusType.ongoing
            const typeText = $(element.find(".infotable tr")[1]).find("td").last().text()
            const type = /Manhwa/.test(typeText)
                ? ComicType.manhwa
                : /Manga/.test(typeText)
                ? ComicType.manga
                : /Manhua/.test(typeText)
                ? ComicType.manhua
                : ComicType.unknown
            
            const genres: KomikuDetail['genres'] = element.find(".seriestugenre a")
                .map((_, e2) => ({
                    title: $(e2).text().trim(),
                    endpoint: $(e2).attr("href")?.split("/").slice(-2, -1)[0]?? "",
                }))
                .get()

            const chapters: KomikuDetail['chapters'] = element.find("#chapterlist li a")
                .map((_, e2): KomikuDetail['chapters'][number] => ({
                    title: $(e2).find(".chapternum").text(),
                    created_at: $(e2).find(".chapterdate").text(),
                    endpoint: $(e2).attr("href")?.split("/").slice(-2, -1)[0]?? ""
                }))
                .get()

            const related: KomikuDetail['related'] = element.find(".listupd a")
                .map((_, e): KomikuPopular => {
                    const typeClass = $(e).find(".type").attr("class") ?? "";
                    const type = /Manhwa/.test(typeClass)
                        ? ComicType.manhwa
                        : /Manga/.test(typeClass)
                        ? ComicType.manga
                        : /Manhua/.test(typeClass)
                        ? ComicType.manhua
                        : ComicType.unknown
                    return {
                        title: $(e).find("img").attr("title")?.trim() ?? "",
                        image: $(e).find("img").attr("src")?.toString() ?? "",
                        type: type,
                        rate: Number($(e).find(".numscore").text().trim()),
                        endpoint: $(e).attr("href")?.split("/").slice(-2, -1)[0]?? ""
                    }
                })
                .get()

            const detail: KomikuDetail = {
                title: element.find(".entry-title").text().replace(/^Komik\s+/i, ""),
                description: element.find(".entry-content p").text().trim(),
                status: status,
                type: type,
                image: element.find(".thumb img").attr("src") ?? "",
                rate: Number(element.find(".num").text()),
                endpoint: endpoint ?? '',
                genres: genres,
                chapters: chapters,
                related: related
            }
            return detail
        } catch (e) {
            throw e
        }
    }
}