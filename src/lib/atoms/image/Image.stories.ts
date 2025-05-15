import type { Meta, StoryObj } from '@storybook/svelte';
import Image from './Image.svelte';

const meta: Meta<typeof Image> = {
	title: 'Design System/atoms/Image',
	component: Image
};

type Story = StoryObj<typeof meta>

export const Placeholder: Story = {
	args: {
		image: 'https://placehold.co/600x400',
		altText: 'Placeholder'
	}
}

export const ArticlePreview: Story = {
	args: { 
		image: 'https://placehold.co/600x400',
		altText: 'Placeholder',
		width: 250,
		left: true
	}
}

export default meta;