import type { Context } from "hono"
import { ResponseHandler } from "../classes/api_response.js"
import { KomikuPopularScraper } from "../data/repositories/komiku/komiku_popular_scraper.js"
import type { KomikuChapter, KomikuDetail, KomikuPopular, KomikuUpdated } from "../data/types/komiku.js"
import type { BlankEnv, BlankInput } from "hono/types"
import { KomikuUpdatedScraper } from "../data/repositories/komiku/komiku_updated_scraper.js"
import type { ApiResponse } from "../data/types/api_response.js"
import { KomikuDetailScraper } from "../data/repositories/komiku/komiku_detail_scraper.js"
import { KomikuSearchScraper } from "../data/repositories/komiku/komiku_search_scraper.js"
import { KomikuChapterScraper } from "../data/repositories/komiku/komiku_chapter_scraper.js"

export class KomikuController {
    static async popular(c: Context<BlankEnv, "/popular", BlankInput>) {
        const scraper = new KomikuPopularScraper()
        
        const popular: KomikuPopular[] = await scraper.scrape()
        return c.json(ResponseHandler.success(popular))
    }

    static async updated(c: Context<BlankEnv, "/updated", BlankInput>) {
        const page = c.req.query("page") ?? 1
        const scraper = new KomikuUpdatedScraper()
        
        const updated: {meta: ApiResponse['meta'], data : KomikuUpdated[]} = await scraper.scrape({ page: Number(page) })
        return c.json(ResponseHandler.success(updated.data, updated.meta))
    }

    static async detail(c: Context<BlankEnv, "/detail/:endpoint", BlankInput>) {
        const endpoint = c.req.param("endpoint") ?? ""
        const scraper = new KomikuDetailScraper()
        
        const detail: KomikuDetail = await scraper.scrape({ endpoint: endpoint })
        return c.json(ResponseHandler.success(detail))
    }

    static async search(c: Context<BlankEnv, "/detail", BlankInput>) {
        const { keyword,  page }: Record<string, string>= c.req.query()
        const scraper = new KomikuSearchScraper()
        
        const search: {meta: ApiResponse['meta'], data : KomikuPopular[]} = await scraper.scrape({keyword: keyword, page: Number(page ?? 1) })
        return c.json(ResponseHandler.success(search.data, search.meta))
    }

    static async chapter(c: Context<BlankEnv, "/chapter/:endpoint", BlankInput>) {
        const endpoint: string = c.req.param("endpoint") ?? ""
        const scraper = new KomikuChapterScraper()
        
        const chapter: KomikuChapter = await scraper.scrape({ endpoint: endpoint })
        return c.json(ResponseHandler.success(chapter))
    }
}