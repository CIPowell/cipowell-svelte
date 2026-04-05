<script lang="ts">
	import type { Component } from 'svelte';
	import Container from '$lib/atoms/container/Container.svelte';
	import Divider from '$lib/atoms/divider/Divider.svelte';
	import ThreeColumnItem from '$lib/molecules/three_column_item/ThreeColumnItem.svelte';

	interface ItemLink {
		label: string;
		href: string;
	}

	interface ThreeColumnItemModel {
		title: string;
		description?: string;
		icon?: Component;
		link?: ItemLink;
		align?: 'left' | 'center';
	}

	interface Props {
		items: ThreeColumnItemModel[];
		variant?: 'default' | 'credibility' | 'feature' | 'focus' | 'cta';
		background?: 'default' | 'soft' | 'plum';
		divider?: boolean;
		align?: 'left' | 'center';
		hover?: boolean;
	}

	let {
		items,
		variant = 'default',
		background = 'default',
		divider = false,
		align = 'left',
		hover = false
	}: Props = $props();

	const isInverse = $derived(background === 'plum');
</script>

<section class={`three-column-section three-column-section--${background}`}>
	<Container>
		<div class="three-column-section__inner">
			{#if divider}
				<Divider inverse={isInverse} />
			{/if}

			<div class="three-column-section__grid" role="list">
				{#each items as item (item.title)}
					<div role="listitem">
						<ThreeColumnItem
							title={item.title}
							description={item.description}
							icon={item.icon}
							link={item.link}
							align={item.align ?? align}
							{hover}
							{variant}
							inverse={isInverse}
						/>
					</div>
				{/each}
			</div>
		</div>
	</Container>
</section>

<style>
	.three-column-section {
		padding-block: var(--space-6);
	}

	.three-column-section--default {
		background: var(--color-surface-default);
		color: var(--color-text-primary);
	}

	.three-column-section--soft {
		background: var(--color-surface-soft);
		color: var(--color-text-primary);
	}

	.three-column-section--plum {
		background: var(--color-surface-plum);
		color: var(--color-text-inverse);
	}

	.three-column-section__inner {
		display: grid;
		gap: var(--space-4);
	}

	.three-column-section__grid {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: var(--space-4);
	}

	.three-column-section__grid > [role='listitem'] {
		height: 100%;
	}

	@media (min-width: 40rem) {
		.three-column-section__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 64rem) {
		.three-column-section__grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.three-column-section--plum :global(.heading),
	.three-column-section--plum :global(.text) {
		color: var(--color-text-inverse);
	}
</style>
