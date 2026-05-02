module.exports = function migration(migration) {
	const blogPost = migration.editContentType('blogPost');

	blogPost
		.createField('description')
		.name('Description')
		.type('Text')
		.required(false)
		.validations([{ size: { min: 1, max: 300 } }]);

	blogPost.changeFieldControl('description', 'builtin', 'multipleLine');
	blogPost.moveField('description').afterField('title');
};
