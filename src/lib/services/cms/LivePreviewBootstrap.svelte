<script lang="ts">
	import { ContentfulLivePreview } from "@contentful/live-preview";

	let { locale } = $props();

	ContentfulLivePreview.init({
		locale: locale,
		enableInspectorMode: true,
		enableLiveUpdates: true
	});
</script>
 