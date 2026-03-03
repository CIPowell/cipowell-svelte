<script lang="ts">
	import { ContentfulLivePreview } from "@contentful/live-preview";

	let {  locale } = $props();

	ContentfulLivePreview.init({
		locale,
		enableInspectorMode: true,
		enableLiveUpdates: true
	});

	ContentfulLivePreview.subscribe('save', {
		callback: async () => {
			window.location.reload();
		}
	})
</script>
 