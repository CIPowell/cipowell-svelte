<script lang="ts">
	type FooterMetaTextTag = 'p' | 'small';
	type FooterMetaTextVariant = 'default' | 'inverse';

	interface Props {
		text: string;
		tag?: FooterMetaTextTag;
		variant?: FooterMetaTextVariant;
	}

	let { text, tag = 'p', variant = 'default' }: Props = $props();
</script>

<svelte:element this={tag} class={`footer-meta footer-meta--${variant}`}>{text}</svelte:element>

<style>
	.footer-meta {
		margin: 0;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 400;
		line-height: 1.5;
		color: var(--footer-meta-color);
	}

	.footer-meta--inverse {
		color: var(--footer-meta-color-inverse);
	}
</style>
