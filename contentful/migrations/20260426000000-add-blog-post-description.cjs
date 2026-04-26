module.exports = function migration(migration) {
	const blogPost = migration.editContentType('blogPost');

	blogPost
		.createField('description')
		.name('Description')
		.type('Text')
		.required(false)
		.validations([
			{
				size: {
					max: 300
				}
			}
		]);

	blogPost.changeFieldControl('description', 'builtin', 'multipleLine', {
		helpText:
			'Short summary used for page descriptions and Open Graph previews. If blank, the site derives a fallback from the post body.'
	});
};
