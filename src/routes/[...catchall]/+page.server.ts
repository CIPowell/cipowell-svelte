import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-svelte";
import { BUILDER_API_KEY } from "$env/static/private";

export async function load(event) {
    const api_key = BUILDER_API_KEY;

    const content = await fetchOneEntry({
        model: 'page',
        apiKey: BUILDER_API_KEY,
        options: getBuilderSearchParams(event.url.searchParams),
        userAttributes: {
            urlPath: event.url.pathname || '/'
        }
    });

    return { content, api_key };
}