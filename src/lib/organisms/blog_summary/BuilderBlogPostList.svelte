<script lang="ts">
    import { BuildIOClient } from "$lib/services/cms/builder_io";
    import type { BlogPostSummary } from "$lib/services/blog/Blog";
    import BlogPostList from "./BlogPostList.svelte";

    export let tags: string[] = [];
    export let posts: BlogPostSummary[] = [];

    const blogClient = new BuildIOClient();

    async function getPosts() {
        posts = await blogClient.getPostPreviews(tags);
    }

    getPosts();

</script>

<BlogPostList {posts} />

<slot></slot>