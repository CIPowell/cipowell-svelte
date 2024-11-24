export interface BlogPostSummary {
    title: string
    slug: string
    blurb: string
    featuredImage: string
    featuredImageAltText: string
    previewText: string 
    published: Date
    lastUpdated: Date
    tags: string[]
}

export interface BlogClient {
    getPostPreviews(tagList: string[]): Promise<BlogPostSummary[]> 
}