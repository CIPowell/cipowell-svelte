<script lang="ts">
	export let heading1 = 'Heading 1';
	export let heading2 = 'Heading 2';
	export let heading3 = 'Heading 3';
	export let heading4 = 'Heading 4';
	export let heading5 = 'Heading 5';
	export let body =
		'Body text preview. Change this in Controls to validate typography, spacing, and readability.';
</script>

<section class="typography-preview">
	<h1>{heading1}</h1>
	<h2>{heading2}</h2>
	<h3>{heading3}</h3>
	<h4>{heading4}</h4>
	<h5>{heading5}</h5>
	<p>{body}</p>
</section>

<style>
	.typography-preview {
		max-width: 48rem;
	}
</style>
