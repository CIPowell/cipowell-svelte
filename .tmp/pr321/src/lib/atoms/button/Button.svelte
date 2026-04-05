<script lang="ts">
	type ButtonVariant =
		| 'primary'
		| 'secondary'
		| 'text-arrow'
		| 'inverse-primary'
		| 'inverse-secondary'
		| 'inverse-text-arrow';

	interface Props {
		label: string;
		href: string;
		variant?: ButtonVariant;
	}

	let { label, href, variant = 'primary' }: Props = $props();
</script>

<a class={`button button--${variant}`} {href}>{label}</a>

<style>
	.button {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		min-height: 2.75rem;
		padding: 0.625rem var(--space-2);
		border-radius: 0.35rem;
		border: 1px solid transparent;
		font-weight: var(--font-weight-medium);
		line-height: 1.2;
		text-decoration: none;
	}

	.button--primary {
		background-color: var(--color-link-primary-bg);
		color: var(--color-link-primary-text);
	}

	.button--secondary {
		border-color: var(--color-link-primary-bg);
		color: var(--color-link-primary-bg);
		background-color: transparent;
	}

	.button--text-arrow,
	.button--inverse-text-arrow {
		padding-inline: 0;
		border: none;
		background-color: transparent;
		gap: var(--space-1);
	}

	.button--text-arrow {
		color: var(--color-link-primary-bg);
	}

	.button--text-arrow::after,
	.button--inverse-text-arrow::after {
		content: '→';
		color: currentColor;
	}

	.button--inverse-primary {
		background-color: var(--color-white);
		color: var(--color-plum-600);
	}

	.button--inverse-secondary {
		border-color: var(--color-white);
		color: var(--color-white);
		background-color: transparent;
	}

	.button--inverse-text-arrow {
		color: var(--color-white);
	}

	.button:focus-visible {
		outline: 3px solid var(--color-focus-ring);
		outline-offset: 2px;
	}
</style>
