<script lang="ts">
	import { onMount } from 'svelte';
	import { isContentfulLivePreviewClientContext } from './preview';

	interface Props {
		enabled: boolean;
		locale: string;
		environment: string;
	}

	let { enabled, locale, environment }: Props = $props();

	const SPACE_ID = 'c85g7urd11yl';
	const LIVE_PREVIEW_SCRIPT_ID = 'contentful-live-preview-sdk';
	const LIVE_PREVIEW_SCRIPT_SRC =
		'https://unpkg.com/@contentful/live-preview@3/dist/live-preview.umd.js';

	type LivePreviewGlobal = {
		init: (config: {
			locale: string;
			environment: string;
			enableInspectorMode: boolean;
			enableLiveUpdates: boolean;
			targetOrigin: string;
			targetOriginPattern: string;
			space: string;
		}) => void;
	};

	async function ensureLivePreviewScript(): Promise<void> {
		if (document.getElementById(LIVE_PREVIEW_SCRIPT_ID)) {
			return;
		}

		await new Promise<void>((resolve, reject) => {
			const script = document.createElement('script');
			script.id = LIVE_PREVIEW_SCRIPT_ID;
			script.src = LIVE_PREVIEW_SCRIPT_SRC;
			script.async = true;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('Failed to load Contentful Live Preview SDK'));
			document.head.appendChild(script);
		});
	}

	onMount(async () => {
		if (!enabled || !isContentfulLivePreviewClientContext()) {
			return;
		}

		try {
			await ensureLivePreviewScript();

			const contentfulWindow = window as Window & {
				ContentfulLivePreview?: LivePreviewGlobal;
			};
			contentfulWindow.ContentfulLivePreview?.init({
				space: SPACE_ID,
				environment,
				locale,
				enableInspectorMode: true,
				enableLiveUpdates: true,
				targetOrigin: 'https://app.contentful.com',
				targetOriginPattern: 'https://app.*.contentful.com'
			});
		} catch (error) {
			console.error('Unable to initialize Contentful Live Preview SDK', error);
		}
	});
</script>
