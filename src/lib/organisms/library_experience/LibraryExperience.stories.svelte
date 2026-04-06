<script context="module" lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LibraryExperience from './LibraryExperience.svelte';
	import { getLibraryPageData } from '$lib/services/library/library';

	const baseArgs = getLibraryPageData();

	const { Story } = defineMeta({
		title: 'Design System/Organisms/LibraryExperience',
		component: LibraryExperience,
		args: baseArgs,
		parameters: {
			docs: {
				description: {
					component:
						'Curated Library landing experience with one mixed reading grid, topic and type filters, and lightweight card chrome for books and articles. Use when you need a destination page that feels editorial instead of archive-like.'
				}
			}
		}
	});
</script>

<Story name="Default" args={baseArgs} />
<Story
	name="Mobile viewport"
	args={baseArgs}
	parameters={{ viewport: { defaultViewport: 'mobile1' } }}
/>
