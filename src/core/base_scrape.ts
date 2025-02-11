export interface ScrapeParams {
    page?: number,
    endpoint?: string,
    keyword?: string,
}

export interface BaseScraper {
    scrape({page, endpoint, keyword}: ScrapeParams): Promise<any>;
}