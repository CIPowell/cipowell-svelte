module.exports = function (migration) {
	const libraryEntry = migration
		.createContentType('libraryEntry')
		.name('Library Entry')
		.description('Shared library entry for books and articles surfaced on the Library pages')
		.displayField('title');

	libraryEntry
		.createField('slug')
		.name('Slug')
		.type('Symbol')
		.required(true)
		.validations([{ unique: true }, { size: { min: 1, max: 120 } }]);

	libraryEntry
		.createField('title')
		.name('Title')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 1, max: 160 } }]);

	libraryEntry
		.createField('format')
		.name('Format')
		.type('Symbol')
		.required(true)
		.defaultValue({ 'en-US': 'book' })
		.validations([{ in: ['book', 'article'] }]);

	libraryEntry
		.createField('creatorText')
		.name('Creator Text')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 1, max: 120 } }]);

	libraryEntry
		.createField('summary')
		.name('Summary')
		.type('Text')
		.required(true)
		.validations([{ size: { min: 1, max: 420 } }]);

	libraryEntry
		.createField('recommendationNote')
		.name('Recommendation Note')
		.type('Text')
		.required(true)
		.validations([{ size: { min: 1, max: 420 } }]);

	libraryEntry
		.createField('miniReview')
		.name('Mini Review')
		.type('Text')
		.required(false)
		.validations([{ size: { max: 420 } }]);

	libraryEntry
		.createField('publicationTitle')
		.name('Publication Title')
		.type('Symbol')
		.required(false)
		.validations([{ size: { max: 120 } }]);

	libraryEntry.createField('publicationDate').name('Publication Date').type('Date').required(false);

	libraryEntry
		.createField('externalUrl')
		.name('External URL')
		.type('Symbol')
		.required(false)
		.validations([{ regexp: { pattern: '^(https?:\\/\\/|\\/).*', flags: '' } }]);

	libraryEntry
		.createField('coverOrThumbnail')
		.name('Cover or Thumbnail')
		.type('Link')
		.linkType('Asset')
		.required(false)
		.validations([{ linkMimetypeGroup: ['image'] }]);

	libraryEntry
		.createField('topics')
		.name('Topics')
		.type('Array')
		.required(false)
		.items({
			type: 'Symbol',
			validations: [{ size: { min: 1, max: 40 } }]
		})
		.validations([{ size: { min: 0, max: 8 } }]);

	libraryEntry
		.createField('readingStatus')
		.name('Reading Status')
		.type('Symbol')
		.required(false)
		.validations([{ in: ['on-the-list', 'reading', 'finished'] }]);

	libraryEntry.createField('startedOn').name('Started On').type('Date').required(false);

	libraryEntry.createField('finishedOn').name('Finished On').type('Date').required(false);

	libraryEntry
		.createField('rating')
		.name('Rating')
		.type('Integer')
		.required(false)
		.validations([{ range: { min: 1, max: 5 } }]);

	libraryEntry
		.createField('notes')
		.name('Notes')
		.type('RichText')
		.required(false)
		.validations([
			{
				enabledNodeTypes: [
					'heading-2',
					'heading-3',
					'ordered-list',
					'unordered-list',
					'blockquote',
					'hr',
					'hyperlink',
					'entry-hyperlink',
					'asset-hyperlink'
				]
			},
			{
				enabledMarks: ['bold', 'italic', 'underline', 'code']
			},
			{
				nodes: {}
			}
		]);

	libraryEntry.changeFieldControl('format', 'builtin', 'dropdown');
	libraryEntry.changeFieldControl('readingStatus', 'builtin', 'dropdown');
};
