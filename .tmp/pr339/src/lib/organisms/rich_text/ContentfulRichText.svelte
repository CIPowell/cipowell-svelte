<script lang="ts">
	import RichTextNode from './RichTextNode.svelte';

	interface RichTextDocument {
		nodeType: string;
		content?: unknown[];
	}

	interface Props {
		document: RichTextDocument | null | undefined;
	}

	let { document }: Props = $props();
</script>

{#if document?.content}
	{#each document.content as node, index (`root-${index}`)}
		<RichTextNode node={node as { nodeType: string; [key: string]: unknown }} />
	{/each}
{/if}
