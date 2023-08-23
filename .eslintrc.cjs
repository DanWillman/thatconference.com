module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:svelte/recommended', 'prettier'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	rules: {
		'no-unused-vars': [2, { args: 'all', argsIgnorePattern: '^_' }]
		//'import/no-unused-modules': [1, { unusedExports: true }]
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
