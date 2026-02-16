<script lang="ts">
	interface Props {
		variant?: 'default' | 'inverse';
	}

	let { variant = 'default' }: Props = $props();
</script>

<hr class={`footer-divider footer-divider--${variant}`} aria-hidden="true" />

<style>
	.footer-divider {
		margin: 0;
		border: none;
		border-top: 1px solid var(--footer-divider-color);
	}

	.footer-divider--inverse {
		border-top-color: var(--footer-divider-color-inverse);
	}
</style>
