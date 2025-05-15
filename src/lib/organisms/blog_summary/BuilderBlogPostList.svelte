<script lang="ts">
    import { BuildIOClient } from "$lib/services/cms/builder_io";
    import type { BlogPostSummary } from "$lib/services/blog/Blog";
    import BlogPostList from "./BlogPostList.svelte";

    interface Props {
        tags?: string[];
        posts?: BlogPostSummary[];
        children?: import('svelte').Snippet;
    }

    let { tags = [], posts = $bindable([]), children }: Props = $props();

    const blogClient = new BuildIOClient();

    async function getPosts() {
        posts = await blogClient.getPostPreviews(tags);
    }

    getPosts();

</script>

<BlogPostList {posts} />

{@render children?.()}