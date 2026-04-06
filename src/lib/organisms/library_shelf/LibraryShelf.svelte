<script lang="ts">
	import type { LibraryEntry } from '$lib/services/library/library';

	interface Props {
		title: string;
		description: string;
		items: LibraryEntry[];
	}

	let { title, description, items }: Props = $props();

	function formatTopic(topic: string) {
		return topic.replace(/\b\w/g, (character) => character.toUpperCase());
	}
</script>

<section class="library-shelf" aria-labelledby={`library-shelf-${title}`}>
	<div class="library-shelf__header">
		<div>
			<h2 id={`library-shelf-${title}`}>{title}</h2>
			<p>{description}</p>
		</div>
		<p class="library-shelf__count">{items.length} on this shelf</p>
	</div>

	<ul class="library-shelf__grid">
		{#each items as item (item.id)}
			<li class="library-shelf__item">
				<article class={`library-shelf__card library-shelf__card--${item.accent}`}>
					<div class="library-shelf__meta">
						<span class="library-shelf__chip">{item.type}</span>
						<span>{item.detail}</span>
					</div>

					<div class="library-shelf__copy">
						<h3>{item.title}</h3>
						<p>{item.summary}</p>
					</div>

					<p class="library-shelf__creator">{item.creator}</p>

					<ul class="library-shelf__topics" aria-label={`${item.title} topics`}>
						{#each item.topics as topic (topic)}
							<li>{formatTopic(topic)}</li>
						{/each}
					</ul>
				</article>
			</li>
		{/each}
	</ul>
</section>

<style>
	.library-shelf {
		display: grid;
		gap: var(--space-3);
		padding: var(--space-4);
		border: 1px solid var(--color-library-panel-border);
		border-radius: 1.5rem;
		background: var(--color-library-panel-surface);
		box-shadow: var(--elevation-library-panel);
	}

	.library-shelf__header {
		display: grid;
		gap: var(--space-2);
		align-items: end;
	}

	.library-shelf__header h2,
	.library-shelf__copy h3,
	.library-shelf__count {
		margin: 0;
	}

	.library-shelf__header p {
		margin: 0;
		color: var(--color-library-panel-muted);
	}

	.library-shelf__count {
		font-size: 0.95rem;
		font-weight: var(--font-weight-semibold);
		color: var(--color-library-chip-text);
	}

	.library-shelf__grid {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: var(--space-3);
		margin: 0;
		padding: 0 0 var(--space-3);
		position: relative;
	}

	.library-shelf__grid::after {
		content: '';
		position: absolute;
		inset: auto 0 0;
		height: 0.95rem;
		border-radius: 999px;
		background: linear-gradient(
			180deg,
			var(--color-library-shelf-rail-top),
			var(--color-library-shelf-rail-bottom)
		);
		box-shadow: var(--elevation-library-rail);
	}

	.library-shelf__item {
		position: relative;
		z-index: 1;
	}

	.library-shelf__card {
		display: grid;
		gap: var(--space-2);
		height: 100%;
		padding: var(--space-3);
		border: 1px solid var(--color-library-card-border);
		border-radius: 1.15rem;
		background: var(--color-library-card-surface);
		box-shadow: var(--elevation-library-card);
		position: relative;
		overflow: hidden;
	}

	.library-shelf__card::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 0.55rem;
		background: var(--color-library-accent-amber);
	}

	.library-shelf__card--sage::before {
		background: var(--color-library-accent-sage);
	}

	.library-shelf__card--ink::before {
		background: var(--color-library-accent-ink);
	}

	.library-shelf__card--rose::before {
		background: var(--color-library-accent-rose);
	}

	.library-shelf__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		align-items: center;
		font-size: 0.9rem;
		color: var(--color-library-card-meta);
	}

	.library-shelf__chip {
		display: inline-flex;
		align-items: center;
		padding: 0.3rem 0.7rem;
		border-radius: 999px;
		background: var(--color-library-chip-surface);
		color: var(--color-library-chip-text);
		font-size: 0.8rem;
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.library-shelf__copy {
		display: grid;
		gap: var(--space-1);
	}

	.library-shelf__copy p,
	.library-shelf__creator {
		margin: 0;
	}

	.library-shelf__creator {
		font-size: 0.95rem;
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
	}

	.library-shelf__topics {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
	}

	.library-shelf__topics li {
		padding: 0.4rem 0.75rem;
		border-radius: 999px;
		background: var(--color-library-topic-surface);
		color: var(--color-library-topic-text);
		font-size: 0.85rem;
	}

	@media (hover: hover) and (prefers-reduced-motion: no-preference) {
		.library-shelf__card {
			transition:
				transform 180ms ease,
				box-shadow 180ms ease;
		}

		.library-shelf__card:hover {
			transform: translateY(-0.2rem);
		}
	}

	@media (min-width: 48rem) {
		.library-shelf__header {
			grid-template-columns: minmax(0, 1fr) auto;
		}

		.library-shelf__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
