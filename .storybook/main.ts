import type { StorybookConfig } from '@storybook/sveltekit';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@chromatic-com/storybook',
		'@storybook/addon-interactions',
		'@storybook/addon-a11y',
		{
			name: "@storybook/addon-docs",
			options: {
				mdxPluginOptions: {
					mdxCompileOptions: {
					  remarkPlugins: [remarkGfm],
					},
				},
			}
		}
	],
	framework: {
		name: '@storybook/sveltekit',
		options: {}
	}
};
export default config;
