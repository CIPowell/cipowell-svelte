<script lang="ts">
	type FooterHeadingTag = 'h2' | 'h3';
	type FooterHeadingVariant = 'default' | 'inverse';

	interface Props {
		text: string;
		tag?: FooterHeadingTag;
		variant?: FooterHeadingVariant;
		id?: string;
	}

	let { text, tag = 'h2', variant = 'default', id }: Props = $props();
</script>

<svelte:element this={tag} {id} class={`footer-heading footer-heading--${variant}`}
	>{text}</svelte:element
>

<style>
	.footer-heading {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(1.125rem, 2vw, 1.25rem);
		font-weight: var(--font-weight-medium);
		line-height: 1.2;
		color: var(--footer-heading-color);
	}

	.footer-heading--inverse {
		color: var(--footer-heading-color-inverse);
	}
</style>
