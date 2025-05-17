import type { Meta, StoryObj } from '@storybook/svelte';
import Breadcrumbs from './Breadcrumbs.svelte';

const meta: Meta<typeof Breadcrumbs> = {
	title: 'Design System/molecules/Breadcrumbs',
	component: Breadcrumbs
};

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		links: [
			{ title: 'Home', target: '/' },
			{ title: 'Library', target: '/library' },
			{ title: 'Data', target: '/library/data' }
		]
	}
};

export default meta;
