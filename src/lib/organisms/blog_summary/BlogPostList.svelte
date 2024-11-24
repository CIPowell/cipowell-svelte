<script lang="ts">
	import BlogPreview from "$lib/molecules/blog/BlogPreview.svelte";
    import type { BlogPostSummary } from "$lib/services/blog/Blog";

    export let posts: BlogPostSummary[]

</script>

<h1>Summary</h1>

{#each posts as post}
    <BlogPreview {post} />
{/each}