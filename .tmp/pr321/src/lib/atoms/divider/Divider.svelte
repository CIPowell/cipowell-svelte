<script lang="ts">
	interface Props {
		inverse?: boolean;
	}

	let { inverse = false }: Props = $props();
</script>

<hr class={`divider ${inverse ? 'divider--inverse' : ''}`} />

<style>
	.divider {
		margin: 0;
		border: 0;
		border-top: 1px solid var(--color-divider-default);
	}

	.divider--inverse {
		border-top-color: var(--color-divider-inverse);
	}
</style>
