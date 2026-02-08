/**
 * Cache wrapper for Contentful API responses using Cloudflare Cache API
 */
export class ContentfulCache {
	private cache: Cache | null = null;
	private cachePrefix = 'contentful-v1';
	private defaultTtl = 60 * 60; // 1 hour in seconds
	private hostNamespace: string;

	constructor(platform?: App.Platform, contentfulHost?: string) {
		// Use Cloudflare's cache if available (production)
		// In development/preview, cache will be null and we'll skip caching
		this.cache = platform?.caches?.default || null;

		// Derive namespace from host to prevent preview/delivery cache pollution
		this.hostNamespace = contentfulHost?.includes('preview') ? 'preview' : 'delivery';
	}

	/**
	 * Get cached response or execute fetch function and cache the result
	 */
	async get<T>(key: string, fetchFn: () => Promise<T>, ttl: number = this.defaultTtl): Promise<T> {
		const cacheKey = this.getCacheKey(key);

		// Try to get from cache first
		if (this.cache) {
			const cachedResponse = await this.cache.match(cacheKey);
			if (cachedResponse) {
				const data = await cachedResponse.json();
				return data as T;
			}
		}

		// If not in cache, fetch the data
		const data = await fetchFn();

		// Store in cache for future requests
		if (this.cache && data) {
			const response = new Response(JSON.stringify(data), {
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}`
				}
			});
			// Don't await - cache in background
			this.cache.put(cacheKey, response).catch((err) => {
				console.error('Failed to cache response:', err);
			});
		}

		return data;
	}

	private getCacheKey(key: string): string {
		// Include host namespace to prevent preview/delivery cache pollution
		return `https://cache.contentful/${this.cachePrefix}/${this.hostNamespace}/${encodeURIComponent(key)}`;
	}
}
