<script lang="ts">
	interface Props {
		image: string;
		altText: string;
		width: number;
		left?: boolean;
	}

	let {
		image,
		altText,
		width,
		left = false
	}: Props = $props();
</script>

<picture class:left>
	<source srcSet={`${image}?width=${width}&format=avif`} />
	<source srcSet={`${image}?width=${width}&format=webp`} />
	<img src={`${image}?width=${width}&format=png`} alt={altText} {width} />
</picture>

<style>
	img {
		max-width: 100%;
		margin: 0.5rem;
	}

	.left {
		display: block;
		float: left;
	}

	.left img {
		margin: 0 1rem 0.5rem 0;
	}
</style>
