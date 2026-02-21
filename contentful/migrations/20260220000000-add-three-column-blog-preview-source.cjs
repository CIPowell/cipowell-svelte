module.exports = function (migration) {
	const blogPreviewSection = migration
		.createContentType('blogPreviewSection')
		.name('Blog Preview Section')
		.description('Three latest blog posts, optionally filtered by subject tag')
		.displayField('internalName');

	blogPreviewSection
		.createField('internalName')
		.name('Internal Name')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 1, max: 120 } }]);

	blogPreviewSection
		.createField('title')
		.name('Title')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 1, max: 90 } }]);

	blogPreviewSection
		.createField('subjectTag')
		.name('Subject Tag')
		.type('Symbol')
		.required(false)
		.validations([{ size: { min: 1, max: 60 } }]);

	blogPreviewSection.changeFieldControl('subjectTag', 'builtin', 'singleLine', {
		helpText: 'Optional tag to filter previews. Leave blank to show latest posts from any subject.'
	});

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
						linkContentType: ['heroSection', 'threeColumnSection', 'blogPreviewSection']
					}
				]
			}
		}
	]);
};
