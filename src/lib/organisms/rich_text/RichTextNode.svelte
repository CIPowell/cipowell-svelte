<script lang="ts">
	import HeroSection from '$lib/organisms/hero_section/HeroSection.svelte';
	import Self from './RichTextNode.svelte';

	type Mark = { type: string };

	type RichTextNodeValue = {
		nodeType: string;
		value?: string;
		marks?: Mark[];
		content?: RichTextNodeValue[];
		data?: Record<string, unknown>;
	};

	type HeroFields = {
		title?: string;
		subtitle?: string;
		primaryCtaLabel?: string;
		primaryCtaHref?: string;
		secondaryCtaLabel?: string;
		secondaryCtaHref?: string;
		backgroundVariant?: 'default' | 'soft' | 'plum';
		align?: 'left' | 'center';
		maxWidth?: 'default' | 'narrow';
	};

	interface Props {
		node: RichTextNodeValue;
	}

	let { node }: Props = $props();

	const hasMark = (marks: Mark[] | undefined, type: string) =>
		Boolean(marks?.some((mark) => mark.type === type));

	const getHeroFields = (target: unknown): HeroFields | null => {
		const entry = target as {
			fields?: HeroFields;
			sys?: { contentType?: { sys?: { id?: string } } };
		};
		if (entry?.sys?.contentType?.sys?.id !== 'heroSection') {
			return null;
		}

		return entry.fields ?? null;
	};

	const asText = (value: unknown) => (typeof value === 'string' ? value : '');
	const asVariant = (value: unknown, options: string[], fallback: string) =>
		typeof value === 'string' && options.includes(value) ? value : fallback;

	const heroFields = $derived(getHeroFields(node?.data?.target));
	const heroPrimaryCta = $derived(
		heroFields?.primaryCtaLabel && heroFields?.primaryCtaHref
			? { label: heroFields.primaryCtaLabel, href: heroFields.primaryCtaHref }
			: undefined
	);
	const heroSecondaryCta = $derived(
		heroFields?.secondaryCtaLabel && heroFields?.secondaryCtaHref
			? { label: heroFields.secondaryCtaLabel, href: heroFields.secondaryCtaHref }
			: undefined
	);
</script>

{#if node.nodeType === 'paragraph'}
	<p>
		{#each node.content ?? [] as child, index (`paragraph-${index}`)}
			<Self node={child} />
		{/each}
	</p>
{:else if node.nodeType === 'heading-1'}
	<h1>
		{#each node.content ?? [] as child, index (`h1-${index}`)}
			<Self node={child} />
		{/each}
	</h1>
{:else if node.nodeType === 'heading-2'}
	<h2>
		{#each node.content ?? [] as child, index (`h2-${index}`)}
			<Self node={child} />
		{/each}
	</h2>
{:else if node.nodeType === 'heading-3'}
	<h3>
		{#each node.content ?? [] as child, index (`h3-${index}`)}
			<Self node={child} />
		{/each}
	</h3>
{:else if node.nodeType === 'unordered-list'}
	<ul>
		{#each node.content ?? [] as child, index (`ul-${index}`)}
			<Self node={child} />
		{/each}
	</ul>
{:else if node.nodeType === 'ordered-list'}
	<ol>
		{#each node.content ?? [] as child, index (`ol-${index}`)}
			<Self node={child} />
		{/each}
	</ol>
{:else if node.nodeType === 'list-item'}
	<li>
		{#each node.content ?? [] as child, index (`li-${index}`)}
			<Self node={child} />
		{/each}
	</li>
{:else if node.nodeType === 'hyperlink'}
	<a href={asText(node.data?.uri)}>
		{#each node.content ?? [] as child, index (`link-${index}`)}
			<Self node={child} />
		{/each}
	</a>
{:else if node.nodeType === 'embedded-asset-block'}
	{@const target = node.data?.target as {
		fields?: { file?: { url?: string }; description?: string; title?: string };
	}}
	{@const fileUrl = target?.fields?.file?.url}
	{#if fileUrl}
		<picture>
			<source srcset={`https:${fileUrl}?w=600&fm=avif`} />
			<source srcset={`https:${fileUrl}?w=600&fm=webp`} />
			<img
				src={`https:${fileUrl}?w=600&fm=png`}
				alt={target?.fields?.description || target?.fields?.title || ''}
			/>
		</picture>
	{/if}
{:else if node.nodeType === 'embedded-entry-block' && heroFields?.title}
	<HeroSection
		title={heroFields.title}
		subtitle={heroFields.subtitle}
		primaryCta={heroPrimaryCta}
		secondaryCta={heroSecondaryCta}
		backgroundVariant={asVariant(
			heroFields.backgroundVariant,
			['default', 'soft', 'plum'],
			'default'
		) as 'default' | 'soft' | 'plum'}
		align={asVariant(heroFields.align, ['left', 'center'], 'left') as 'left' | 'center'}
		maxWidth={asVariant(heroFields.maxWidth, ['default', 'narrow'], 'default') as
			| 'default'
			| 'narrow'}
	/>
{:else if node.nodeType === 'text'}
	{#if hasMark(node.marks, 'bold')}
		<strong>{node.value}</strong>
	{:else if hasMark(node.marks, 'italic')}
		<em>{node.value}</em>
	{:else}
		{node.value}
	{/if}
{/if}
