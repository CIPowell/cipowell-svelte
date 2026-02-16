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
