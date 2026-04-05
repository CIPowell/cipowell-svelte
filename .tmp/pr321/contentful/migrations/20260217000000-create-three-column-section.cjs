module.exports = function (migration) {
	const threeColumnItem = migration
		.createContentType('threeColumnItem')
		.name('Three Column Item')
		.description('Reusable item for three-column section content variants')
		.displayField('title');

	threeColumnItem
		.createField('title')
		.name('Title')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 1, max: 90 } }]);

	threeColumnItem
		.createField('description')
		.name('Description')
		.type('Text')
		.required(false)
		.validations([{ size: { max: 240 } }]);

	threeColumnItem
		.createField('iconType')
		.name('Icon Type')
		.type('Symbol')
		.required(false)
		.defaultValue({ 'en-US': 'badge' })
		.validations([{ in: ['none', 'badge', 'spark', 'shield'] }]);

	threeColumnItem
		.createField('linkLabel')
		.name('Link Label')
		.type('Symbol')
		.required(false)
		.validations([{ size: { max: 60 } }]);

	threeColumnItem.createField('linkHref').name('Link URL').type('Symbol').required(false);

	threeColumnItem
		.createField('align')
		.name('Alignment')
		.type('Symbol')
		.required(false)
		.defaultValue({ 'en-US': 'left' })
		.validations([{ in: ['left', 'center'] }]);

	const threeColumnSection = migration
		.createContentType('threeColumnSection')
		.name('Three Column Section')
		.description('Reusable three-column section for page body embeds')
		.displayField('internalName');

	threeColumnSection
		.createField('internalName')
		.name('Internal Name')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 1, max: 120 } }]);

	threeColumnSection
		.createField('items')
		.name('Items')
		.type('Array')
		.required(true)
		.items({
			type: 'Link',
			linkType: 'Entry',
			validations: [{ linkContentType: ['threeColumnItem'] }]
		})
		.validations([{ size: { min: 1, max: 3 } }]);

	threeColumnSection
		.createField('variant')
		.name('Variant')
		.type('Symbol')
		.required(false)
		.defaultValue({ 'en-US': 'default' })
		.validations([{ in: ['default', 'credibility', 'feature', 'focus', 'cta'] }]);

	threeColumnSection
		.createField('background')
		.name('Background')
		.type('Symbol')
		.required(false)
		.defaultValue({ 'en-US': 'default' })
		.validations([{ in: ['default', 'soft', 'plum'] }]);

	threeColumnSection.createField('divider').name('Show Divider').type('Boolean').required(false);

	threeColumnSection
		.createField('align')
		.name('Alignment')
		.type('Symbol')
		.required(false)
		.defaultValue({ 'en-US': 'left' })
		.validations([{ in: ['left', 'center'] }]);

	threeColumnSection
		.createField('hover')
		.name('Enable Hover Cards')
		.type('Boolean')
		.required(false);

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
				'hyperlink',
				'entry-hyperlink',
				'asset-hyperlink'
			]
		},
		{
			enabledMarks: ['bold', 'italic', 'underline', 'code']
		},
		{
			nodes: {
				'embedded-entry-block': [
					{
						linkContentType: ['heroSection', 'threeColumnSection']
					}
				]
			}
		}
	]);
};
