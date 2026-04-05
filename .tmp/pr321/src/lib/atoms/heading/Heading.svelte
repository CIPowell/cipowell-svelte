<script lang="ts">
	type HeadingLevel = 1 | 2 | 3 | 4 | 5;

	interface Props {
		level?: HeadingLevel;
		id?: string;
		align?: 'left' | 'center';
		text: string;
	}

	let { level = 1, id, align = 'left', text }: Props = $props();
</script>

<svelte:element this={`h${level}`} {id} class={`heading heading--${align}`}>{text}</svelte:element>

<style>
	.heading {
		margin: 0;
		font-family: var(--font-heading);
		font-size: var(--font-size-h1);
		font-weight: var(--font-weight-semibold);
		line-height: var(--line-height-tight);
		text-wrap: balance;
	}

	.heading--center {
		text-align: center;
	}
</style>
