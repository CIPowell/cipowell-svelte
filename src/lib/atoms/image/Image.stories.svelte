<script context="module" lang="ts">
	export const meta = {
		title: 'Design System/atoms/Image',
		component: Image
	};
</script>

<script lang="ts">
	import { Template, Story } from '@storybook/addon-svelte-csf';
	import Image from './Image.svelte';
</script>

<Template let:args>
	<Image {...args} />
	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo in ligula a euismod.
		Aliquam tincidunt sem tincidunt ante condimentum semper. Morbi cursus justo urna, in finibus dui
		pulvinar in. Curabitur commodo dolor vitae nisi hendrerit, faucibus aliquam elit gravida.
		Phasellus lorem ipsum, sodales nec nulla id, posuere iaculis quam. Cras feugiat, dolor a lacinia
		tincidunt, est quam pellentesque ante, id condimentum elit ante quis massa. Integer sodales ante
		sit amet metus tristique, ac sagittis arcu efficitur. Nam tincidunt, odio sit amet venenatis
		tempor, tortor velit mollis leo, a finibus tellus mauris a dolor. Nam id nisi felis. Maecenas
		cursus sem eget est consectetur eleifend. Pellentesque id ornare urna. Proin blandit leo nec
		velit pulvinar, non volutpat enim sodales. Sed vel sagittis nunc, id dignissim velit.
	</p>
	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo in ligula a euismod.
		Aliquam tincidunt sem tincidunt ante condimentum semper. Morbi cursus justo urna, in finibus dui
		pulvinar in. Curabitur commodo dolor vitae nisi hendrerit, faucibus aliquam elit gravida.
		Phasellus lorem ipsum, sodales nec nulla id, posuere iaculis quam. Cras feugiat, dolor a lacinia
		tincidunt, est quam pellentesque ante, id condimentum elit ante quis massa. Integer sodales ante
		sit amet metus tristique, ac sagittis arcu efficitur. Nam tincidunt, odio sit amet venenatis
		tempor, tortor velit mollis leo, a finibus tellus mauris a dolor. Nam id nisi felis. Maecenas
		cursus sem eget est consectetur eleifend. Pellentesque id ornare urna. Proin blandit leo nec
		velit pulvinar, non volutpat enim sodales. Sed vel sagittis nunc, id dignissim velit.
	</p>
</Template>

<Story
	name="Placeholder"
	args={{
		image: 'https://placehold.co/600x400',
		altText: 'Placeholder'
	}}
/>

<Story
	name="Article Preview"
	args={{
		image: 'https://placehold.co/600x400',
		altText: 'Placeholder',
		width: 250,
		left: true
	}}
/>
