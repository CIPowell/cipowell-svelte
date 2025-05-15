<script module lang="ts">
	export const meta = {
		title: 'Design System/molecules/blog/Blog Post List',
		component: BlogPostList
	};
</script>

<script lang="ts">
	import { Template, Story } from '@storybook/addon-svelte-csf';
	import BlogPostList from './BlogPostList.svelte';
</script>

<Template >
	{#snippet children({ args })}
		<BlogPostList {...args} />
	{/snippet}
</Template>

<Story
	name="Normal"
	args={{ posts: [{
		title: 'Blog title',
		slug: '/article',
		blurb:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo in ligula a euismod. Aliquam tincidunt sem tincidunt ante condimentum semper. Morbi cursus justo urna, in finibus dui pulvinar in. Curabitur commodo dolor vitae nisi hendrerit, faucibus aliquam elit gravida. Phasellus lorem ipsum, sodales nec nulla id, posuere iaculis quam. Cras feugiat, dolor a lacinia tincidunt, est quam pellentesque ante, id condimentum elit ante quis massa. Integer sodales ante sit amet metus tristique, ac sagittis arcu efficitur. Nam tincidunt, odio sit amet venenatis tempor, tortor velit mollis leo, a finibus tellus mauris a dolor. Nam id nisi felis. Maecenas cursus sem eget est consectetur eleifend. Pellentesque id ornare urna. Proin blandit leo nec velit pulvinar, non volutpat enim sodales. Sed vel sagittis nunc, id dignissim velit.',
		featuredImage: 'https://placehold.co/600x400',
		featuredImageAltText: 'placeholder Image'
	}, {
		title: 'Blog title',
		slug: '/article',
		blurb:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis commodo in ligula a euismod. Aliquam tincidunt sem tincidunt ante condimentum semper. Morbi cursus justo urna, in finibus dui pulvinar in. Curabitur commodo dolor vitae nisi hendrerit, faucibus aliquam elit gravida. Phasellus lorem ipsum, sodales nec nulla id, posuere iaculis quam. Cras feugiat, dolor a lacinia tincidunt, est quam pellentesque ante, id condimentum elit ante quis massa. Integer sodales ante sit amet metus tristique, ac sagittis arcu efficitur. Nam tincidunt, odio sit amet venenatis tempor, tortor velit mollis leo, a finibus tellus mauris a dolor. Nam id nisi felis. Maecenas cursus sem eget est consectetur eleifend. Pellentesque id ornare urna. Proin blandit leo nec velit pulvinar, non volutpat enim sodales. Sed vel sagittis nunc, id dignissim velit.',
		featuredImage: 'https://placehold.co/600x400',
		featuredImageAltText: 'placeholder Image'
	}]}	}
/>