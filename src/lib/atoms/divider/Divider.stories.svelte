<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Divider from './Divider.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Atoms/Divider',
		component: Divider
	});
</script>

<Story name="Default" />
<Story name="Inverse" args={{ inverse: true }} />
