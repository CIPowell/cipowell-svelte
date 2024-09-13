import { fetchEntries } from "@builder.io/sdk-svelte";
import { afterEach, beforeEach, describe, test, vi, expect } from "vitest";
import { BuildIOClient } from "./builder_io";

vi.mock('@builder.io/sdk-svelte', () => ({
    fetchEntries: vi.fn()
}));

describe('Builder.io Client', () => {
    let client: BuildIOClient;

    beforeEach(() => {
        client = new BuildIOClient("TestApiKey");
    })

    afterEach(() => {
        vi.clearAllMocks();
    });

    test('Get Nav Links', async () => {
        fetchEntries.mockResolvedValueOnce([
            {
                data: {
                    title: 'Home',
                    url: '/'
                }
            },
            {
                data: {
                    title: 'Blog',
                    url: '/blog'
                }
            }
        ]);

        let links = await client.getGlobalNavLinks();

        expect(fetchEntries).toHaveBeenCalledTimes(1);
        expect(fetchEntries).toHaveBeenLastCalledWith({
            apiKey: 'TestApiKey',
            model: 'page'
        });

        expect(links).toHaveLength(2);
        expect(links[0]).toEqual({ title: 'Home', target: '/'})
    });
});