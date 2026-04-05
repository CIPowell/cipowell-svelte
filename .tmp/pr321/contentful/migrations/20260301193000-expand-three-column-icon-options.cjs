module.exports = function (migration) {
	const threeColumnItem = migration.editContentType('threeColumnItem');

	threeColumnItem
		.createField('iconName')
		.name('Icon Name')
		.type('Symbol')
		.required(false)
		.validations([
			{ size: { max: 60 } },
			{ in: ['badge', 'spark', 'shield', 'chart', 'users', 'code', 'globe'] }
		]);

	threeColumnItem
		.editField('iconType')
		.validations([{ in: ['none', 'badge', 'spark', 'shield', 'chart', 'users', 'code', 'globe'] }]);
};
