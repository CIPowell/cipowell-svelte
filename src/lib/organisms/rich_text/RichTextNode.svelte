<script lang="ts">
	import type { Component } from 'svelte';
	import HeroSection from '$lib/organisms/hero_section/HeroSection.svelte';
	import ThreeColumnSection from '$lib/organisms/three_column_section/ThreeColumnSection.svelte';
	import BadgeIcon from '$lib/icons/BadgeIcon.svelte';
	import SparkIcon from '$lib/icons/SparkIcon.svelte';
	import ShieldIcon from '$lib/icons/ShieldIcon.svelte';
	import Self from './RichTextNode.svelte';

	type Mark = { type: string };

	type RichTextNodeValue = {
		nodeType: string;
		value?: string;
		marks?: Mark[];
		content?: RichTextNodeValue[];
		data?: Record<string, unknown>;
	};

	type RichTextEmbeddedEntry = {
		fields?: Record<string, unknown>;
		sys?: { contentType?: { sys?: { id?: string } } };
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

	type ThreeColumnItemFields = {
		title?: string;
		description?: string;
		iconType?: string;
		linkLabel?: string;
		linkHref?: string;
		align?: 'left' | 'center';
	};

	type ThreeColumnSectionFields = {
		items?: Array<{ fields?: ThreeColumnItemFields }>;
		variant?: 'default' | 'credibility' | 'feature' | 'focus' | 'cta';
		background?: 'default' | 'soft' | 'plum';
		divider?: boolean;
		align?: 'left' | 'center';
		hover?: boolean;
	};

	type BlogPreviewSectionFields = {
		title?: string;
		subjectTag?: string;
		items?: Array<{ fields?: ThreeColumnItemFields }>;
	};

	type ThreeColumnItemViewModel = {
		title: string;
		description?: string;
		icon?: Component;
		link?: { label: string; href: string };
		align?: 'left' | 'center';
	};

	interface Props {
		node: RichTextNodeValue;
	}

	let { node }: Props = $props();

	const hasMark = (marks: Mark[] | undefined, type: string) =>
		Boolean(marks?.some((mark) => mark.type === type));

	const asText = (value: unknown) => (typeof value === 'string' ? value : '');
	const asVariant = (value: unknown, options: string[], fallback: string) =>
		typeof value === 'string' && options.includes(value) ? value : fallback;

	const getEmbeddedEntry = (target: unknown): RichTextEmbeddedEntry | null => {
		const entry = target as RichTextEmbeddedEntry;
		if (!entry?.sys?.contentType?.sys?.id) {
			return null;
		}

		return entry;
	};

	const getHeroFields = (target: unknown): HeroFields | null => {
		const entry = getEmbeddedEntry(target);
		if (entry?.sys?.contentType?.sys?.id !== 'heroSection') {
			return null;
		}

		return (entry.fields as HeroFields) ?? null;
	};

	const getThreeColumnSectionFields = (target: unknown): ThreeColumnSectionFields | null => {
		const entry = getEmbeddedEntry(target);
		if (entry?.sys?.contentType?.sys?.id !== 'threeColumnSection') {
			return null;
		}

		return (entry.fields as ThreeColumnSectionFields) ?? null;
	};

	const getBlogPreviewSectionFields = (target: unknown): BlogPreviewSectionFields | null => {
		const entry = getEmbeddedEntry(target);
		if (entry?.sys?.contentType?.sys?.id !== 'blogPreviewSection') {
			return null;
		}

		return (entry.fields as BlogPreviewSectionFields) ?? null;
	};

	const iconByType: Record<string, Component> = {
		badge: BadgeIcon,
		spark: SparkIcon,
		shield: ShieldIcon
	};

	const mapThreeColumnItems = (
		items: ThreeColumnSectionFields['items']
	): ThreeColumnItemViewModel[] => {
		if (!items?.length) {
			return [];
		}

		return items.flatMap((item) => {
			const title = asText(item.fields?.title).trim();
			if (!title) {
				return [];
			}

			const description = asText(item.fields?.description).trim();
			const iconType = asText(item.fields?.iconType);
			const linkLabel = asText(item.fields?.linkLabel).trim();
			const linkHref = asText(item.fields?.linkHref).trim();
			const link = linkLabel && linkHref ? { label: linkLabel, href: linkHref } : undefined;
			const align = asVariant(item.fields?.align, ['left', 'center'], 'left') as 'left' | 'center';

			return [
				{
					title,
					description: description || undefined,
					icon: iconByType[iconType],
					link,
					align
				}
			];
		});
	};

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

	const threeColumnFields = $derived(getThreeColumnSectionFields(node?.data?.target));
	const threeColumnItems = $derived(mapThreeColumnItems(threeColumnFields?.items));
	const blogPreviewFields = $derived(getBlogPreviewSectionFields(node?.data?.target));
	const blogPreviewItems = $derived(mapThreeColumnItems(blogPreviewFields?.items));
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
{:else if node.nodeType === 'embedded-entry-block' && threeColumnItems.length > 0}
	<ThreeColumnSection
		items={threeColumnItems}
		variant={asVariant(
			threeColumnFields?.variant,
			['default', 'credibility', 'feature', 'focus', 'cta'],
			'default'
		) as 'default' | 'credibility' | 'feature' | 'focus' | 'cta'}
		background={asVariant(threeColumnFields?.background, ['default', 'soft', 'plum'], 'default') as
			| 'default'
			| 'soft'
			| 'plum'}
		divider={Boolean(threeColumnFields?.divider)}
		align={asVariant(threeColumnFields?.align, ['left', 'center'], 'left') as 'left' | 'center'}
		hover={Boolean(threeColumnFields?.hover)}
	/>
{:else if node.nodeType === 'embedded-entry-block' && blogPreviewItems.length > 0}
	<section>
		{#if blogPreviewFields?.title}
			<h2>{blogPreviewFields.title}</h2>
		{/if}
		<ThreeColumnSection items={blogPreviewItems} variant="cta" background="soft" />
	</section>
{:else if node.nodeType === 'text'}
	{#if hasMark(node.marks, 'bold')}
		<strong>{node.value}</strong>
	{:else if hasMark(node.marks, 'italic')}
		<em>{node.value}</em>
	{:else}
		{node.value}
	{/if}
{/if}
