import * as cheerio from "cheerio";
import type { BaseScraper, ScrapeParams } from "../../../core/base_scrape.js";
import { KomikuFetcher } from "../../../services/fetcher/komiku_fetcher.js";
import { type KomikuChapter } from "../../types/komiku.js";

export class KomikuChapterScraper implements BaseScraper {
    async scrape({ endpoint }: ScrapeParams): Promise<KomikuChapter> {
        if (!endpoint) throw new Error("Endpoint is required");
        try {
            const html = await KomikuFetcher.getChapter(endpoint ?? "")

            const $ = cheerio.load(html)

            const element = $("#content")

            const scriptContent = element.find(".wrapper script").toArray()
                .map(el => $(el).html() ?? "")
                .find(content => content.includes("ts_reader.run")) || "";

            const jsonString = scriptContent.match(/ts_reader\.run\((\{.*\})\)/)?.[1];
            const parsedJson = jsonString ? JSON.parse(jsonString) : null;
            const images = parsedJson?.sources?.[0]?.images ?? [];

            return {
                title: element.find(".allc a").text(),
                endpoint: element.find(".allc a").attr("href")?.split("/").slice(-2, -1)[0] ?? "",
                title_chapter: element.find(".entry-title").text().replace(/^Komik\s+/i, ""),
                endpoint_chapter: element.find(".ts-breadcrumb > div > span").last().find("a").attr("href")?.split("/").slice(-2, -1)[0] ?? "",
                chapters: images
            }
        } catch (e) {
            throw e
        }
    }
}