module.exports = function migration(migration) {
  const blogPost = migration.editContentType('blogPost');

  blogPost.name('Blog Post');
  blogPost.description('A blog post');
  blogPost.displayField('title');

  blogPost.editField('title').name('Title').type('Symbol').required(true).validations([{ unique: true }]);

  blogPost.editField('slug').name('slug').type('Symbol').required(true).validations([{ unique: true }]);

  blogPost.editField('body').name('Body').type('RichText').required(false).validations([{ nodes: {} }]);

  blogPost.editField('video').name('Video').type('Object').required(false).validations([]);

  blogPost
    .editField('tags')
    .name('tags')
    .type('Array')
    .required(false)
    .items({
      type: 'Symbol',
      validations: []
    })
    .validations([
      {
        size: {
          min: 0,
          max: 5
        }
      }
    ]);
};
