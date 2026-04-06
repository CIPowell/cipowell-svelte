<script lang="ts">
	import LibraryExperience from '$lib/organisms/library_experience/LibraryExperience.svelte';
	import type { LibraryPageData } from '$lib/services/library/library';

	interface Props {
		data: LibraryPageData;
	}

	let { data }: Props = $props();
</script>

<LibraryExperience entries={data.entries} topics={data.topics} counts={data.counts} />
