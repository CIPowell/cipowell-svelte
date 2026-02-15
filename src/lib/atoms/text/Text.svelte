<script lang="ts">
	interface Props {
		text: string;
		align?: 'left' | 'center';
		large?: boolean;
	}

	let { text, align = 'left', large = false }: Props = $props();
</script>

<p class={`text text--${align} ${large ? 'text--large' : ''}`}>{text}</p>

<style>
	.text {
		margin: 0;
		line-height: var(--line-height-body);
	}

	.text--large {
		font-size: var(--font-size-body-lg);
	}

	.text--center {
		text-align: center;
	}
</style>
