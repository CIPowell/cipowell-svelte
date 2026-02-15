module.exports = function (migration) {
	const heroSection = migration
		.createContentType('heroSection')
		.name('Hero Section')
		.description('Reusable hero section for embedded rich text content')
		.displayField('title');

	heroSection
		.createField('title')
		.name('Title')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 1, max: 140 } }]);

	heroSection
		.createField('subtitle')
		.name('Subtitle')
		.type('Text')
		.required(false)
		.validations([{ size: { max: 320 } }]);

	heroSection
		.createField('primaryCtaLabel')
		.name('Primary CTA Label')
		.type('Symbol')
		.required(false);

	heroSection.createField('primaryCtaHref').name('Primary CTA URL').type('Symbol').required(false);

	heroSection
		.createField('secondaryCtaLabel')
		.name('Secondary CTA Label')
		.type('Symbol')
		.required(false);

	heroSection
		.createField('secondaryCtaHref')
		.name('Secondary CTA URL')
		.type('Symbol')
		.required(false);

	heroSection
		.createField('backgroundVariant')
		.name('Background Variant')
		.type('Symbol')
		.required(false)
		.defaultValue({ 'en-US': 'default' })
		.validations([{ in: ['default', 'soft', 'plum'] }]);

	heroSection
		.createField('align')
		.name('Alignment')
		.type('Symbol')
		.required(false)
		.defaultValue({ 'en-US': 'left' })
		.validations([{ in: ['left', 'center'] }]);

	heroSection
		.createField('maxWidth')
		.name('Max Width')
		.type('Symbol')
		.required(false)
		.defaultValue({ 'en-US': 'default' })
		.validations([{ in: ['default', 'narrow'] }]);

	const page = migration.editContentType('page');
	page.editField('content').validations([
		{
			enabledNodeTypes: [
				'heading-1',
				'heading-2',
				'heading-3',
				'heading-4',
				'heading-5',
				'heading-6',
				'ordered-list',
				'unordered-list',
				'hr',
				'blockquote',
				'embedded-asset-block',
				'embedded-entry-block',
				'paragraph'
			]
		},
		{
			enabledMarks: ['bold', 'italic', 'underline', 'code']
		},
		{
			enabledHyperlinkTypes: ['entry', 'asset', 'url']
		},
		{
			nodes: {
				'embedded-entry-block': [
					{
						linkContentType: ['heroSection']
					}
				]
			}
		}
	]);
};
