import jqueryConfig from "eslint-config-jquery";
import globals from "globals";

export default [
	{

		// Only global ignores will bypass the parser
		// and avoid JS parsing errors
		// See https://github.com/eslint/eslint/discussions/17412
		ignores: [
			".release-it.cjs",
			"dist",
			"external"
		]
	},

	{
		files: [
			"build/**"
		],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				...globals.node
			}
		},
		rules: {
			...jqueryConfig.rules
		}
	},

	{
		files: [
			"jquery.simulate.js",
			"test/**/*"
		],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: "script",
			globals: {
				...globals.browser,
				"jQuery": true
			}
		},
		rules: {
			...jqueryConfig.rules,
			strict: [ "error", "function" ],
			"no-unused-vars": [
				"error",
				{
					args: "after-used",
					argsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_"
				}
			]
		}
	},

	{
		files: [
			"test/**/*"
		],
		languageOptions: {
			globals: {
				"QUnit": true
			}
		},
		rules: {
			strict: [ "error", "global" ]
		}
	}
];
