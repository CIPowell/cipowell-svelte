<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		maxWidth?: 'default' | 'narrow';
		children?: Snippet;
	}

	let { maxWidth = 'default', children }: Props = $props();
</script>

<div class={`container container--${maxWidth}`}>
	{@render children?.()}
</div>

<style>
	.container {
		width: 100%;
		margin-inline: auto;
		padding-inline: var(--space-2);
	}

	.container--default {
		max-width: var(--container-default);
	}

	.container--narrow {
		max-width: var(--container-narrow);
	}
</style>
