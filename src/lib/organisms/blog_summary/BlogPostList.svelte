<script lang="ts">
	import BlogPreview from "$lib/molecules/blog/BlogPreview.svelte";
    import type { BlogPostSummary } from "$lib/services/blog/Blog";

    interface Props {
        posts: BlogPostSummary[];
    }

    let { posts }: Props = $props();

</script>

<h1>Summary</h1>

{#each posts as post}
    <BlogPreview {post} />
{/each}