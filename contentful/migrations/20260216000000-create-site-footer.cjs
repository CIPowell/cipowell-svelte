module.exports = function (migration) {
	const footerLink = migration
		.createContentType('footerLink')
		.name('Footer Link')
		.description('Reusable link item for footer columns')
		.displayField('label');

	footerLink
		.createField('label')
		.name('Label')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 1, max: 60 } }]);

	footerLink
		.createField('href')
		.name('Href')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 1, max: 255 } }]);

	const siteFooter = migration
		.createContentType('siteFooter')
		.name('Site Footer')
		.description('Global footer content managed in Contentful')
		.displayField('internalName');

	siteFooter
		.createField('internalName')
		.name('Internal Name')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 1, max: 80 } }]);

	siteFooter
		.createField('brandTagline')
		.name('Brand Tagline')
		.type('Text')
		.required(true)
		.validations([{ size: { min: 1, max: 180 } }]);

	siteFooter
		.createField('navigationTitle')
		.name('Navigation Column Title')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 1, max: 50 } }]);

	siteFooter
		.createField('navigationLinks')
		.name('Navigation Links')
		.type('Array')
		.required(true)
		.items({
			type: 'Link',
			linkType: 'Entry',
			validations: [{ linkContentType: ['footerLink'] }]
		})
		.validations([{ size: { min: 1, max: 8 } }]);

	siteFooter
		.createField('writingTitle')
		.name('Writing Column Title')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 1, max: 50 } }]);

	siteFooter
		.createField('writingLinks')
		.name('Writing Links')
		.type('Array')
		.required(true)
		.items({
			type: 'Link',
			linkType: 'Entry',
			validations: [{ linkContentType: ['footerLink'] }]
		})
		.validations([{ size: { min: 1, max: 8 } }]);

	siteFooter
		.createField('connectTitle')
		.name('Connect Column Title')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 1, max: 50 } }]);

	siteFooter
		.createField('socialLinks')
		.name('Social Links')
		.type('Array')
		.required(true)
		.items({
			type: 'Link',
			linkType: 'Entry',
			validations: [{ linkContentType: ['footerLink'] }]
		})
		.validations([{ size: { min: 1, max: 10 } }]);

	siteFooter
		.createField('email')
		.name('Contact Email')
		.type('Symbol')
		.required(true)
		.validations([{ size: { min: 3, max: 100 } }]);

	siteFooter
		.createField('metaText')
		.name('Meta Text')
		.type('Symbol')
		.required(false)
		.validations([{ size: { max: 120 } }]);
};
