import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import RichTextNode from './RichTextNode.svelte';

test('renders embedded three column section entries from contentful rich text', () => {
	render(RichTextNode, {
		node: {
			nodeType: 'embedded-entry-block',
			data: {
				target: {
					sys: { contentType: { sys: { id: 'threeColumnSection' } } },
					fields: {
						variant: 'feature',
						background: 'soft',
						items: [
							{
								fields: {
									title: 'Build',
									description: 'Designing resilient systems',
									iconType: 'badge'
								}
							},
							{
								fields: {
									title: 'Grow',
									description: 'Developing engineers',
									iconType: 'spark',
									linkLabel: 'See more',
									linkHref: '/services'
								}
							}
						]
					}
				}
			}
		}
	});

	expect(screen.getByText('Build')).toBeTruthy();
	expect(screen.getByText('Designing resilient systems')).toBeTruthy();
	expect(screen.getByRole('link', { name: 'See more' }).getAttribute('href')).toBe('/services');
});

test('renders embedded blog preview section entries from contentful rich text', () => {
	render(RichTextNode, {
		node: {
			nodeType: 'embedded-entry-block',
			data: {
				target: {
					sys: { contentType: { sys: { id: 'blogPreviewSection' } } },
					fields: {
						title: 'Latest writing',
						items: [
							{
								fields: {
									title: 'Post one',
									linkLabel: 'Read post',
									linkHref: '/thoughts/post-one'
								}
							},
							{
								fields: {
									title: 'Post two',
									linkLabel: 'Read post',
									linkHref: '/thoughts/post-two'
								}
							}
						]
					}
				}
			}
		}
	});

	expect(screen.getByRole('heading', { level: 2, name: 'Latest writing' })).toBeTruthy();
	expect(screen.getByRole('link', { name: 'Post one Read post' }).getAttribute('href')).toBe(
		'/thoughts/post-one'
	);
});
