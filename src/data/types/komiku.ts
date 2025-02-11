export enum ComicType {
    manga = "Manga",
    manhwa = "Manhwa",
    manhua = "Manhua",
    unknown = "Unknwon"
}

export enum StatusType {
    ongoing = "Ongoing",
    completed = "Completed",
    hiatus = "Hiatus",
}

export interface KomikuPopular {
    title: string;
    image: string;
    type: ComicType;
    rate: number;
    endpoint: string;
}

export interface KomikuUpdated {
    id: number;
    title: string;
    image: string;
    type: ComicType;
    endpoint: string;
    latest_chapter: {
        title: string;
        created_at: string;
        endpoint: string;
    }[]
}

export interface KomikuDetail {
    title: string;
    description: string;
    image: string;
    status: StatusType;
    type: ComicType;
    rate: number;
    endpoint: string;
    genres: {
        title: string;
        endpoint: string;
    }[]
    chapters: {
        title: string;
        created_at: string;
        endpoint: string;
    }[]
    related: KomikuPopular[]
}

export interface KomikuChapter {
    title: string;
    endpoint: string;
    title_chapter: string;
    endpoint_chapter?: string;
    chapters: string[];
}