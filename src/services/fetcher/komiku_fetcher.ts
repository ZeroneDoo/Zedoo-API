export class KomikuFetcher {
    static readonly BASE_URL = "https://komiku.one"
    static readonly headers = {
        "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0",
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://komiku.one',
        'Connection': 'keep-alive'
    }

    static async getPopular(options?: RequestInit) {
        try {
            const data = await fetch(`${this.BASE_URL}`, {
                headers: this.headers,
                ...options
            })
            const text = await data.text()


            return text
        } catch (e) {
            throw e
        }
    }

    static async getUpdated(page: number, options?: RequestInit) {
        try {
            const url = page != 1 ? `${this.BASE_URL}/page/${page}` : `${this.BASE_URL}`
            const data = await fetch(url, {
                headers: this.headers,
                ...options
            })
            const text = await data.text()

            return text
        } catch (e) {
            throw e
        }
    }

    static async getDetail(endpoint: string, options?: RequestInit) {
        try {
            const data = await fetch(`${this.BASE_URL}/manga/${endpoint}`, {
                headers: this.headers,
                ...options
            })
            const text = await data.text()

            return text
        } catch (e) {
            throw e
        }
    }
    static async getBySearch(keyword: string, page: number, options?: RequestInit) {
        try {
            const data = await fetch(`${this.BASE_URL}/page/${page}/?s=${keyword}`, {
                headers: this.headers,
                ...options
            })
            const text = await data.text()

            return text
        } catch (e) {
            throw e
        }
    }

    static async getChapter(endpoint: string, options?: RequestInit) {
        try {
            const data = await fetch(`${this.BASE_URL}/${endpoint}`, {
                headers: this.headers,
                ...options
            })
            const text = await data.text()

            return text
        } catch (e) {
            throw e
        }
    }
}