({
	//appDir: "./public",
	baseUrl:"./public",
	removeCombined: true,
	name: "js/main",
	out: "admin/py.min.js",
	optimize: "uglify",
	paths: {
		"adminRoutes": "../admin/js/routes",
		"admin-js": "../admin/js",
		"config": "../dev/blank-def",
		"js": "../dev",
		"libs": "libs/js",
		"jquery": "empty:",
		"bootstrap": "empty:",
		"angular": "empty:",
		"angular-sanitize": "empty:",
		"angular-ui-router": "empty:",
		"angular-ui-bootstrap": "empty:",
		"jquery-cookie": "empty:",
		"i18next": "empty:",
		"moment": "empty:",
		"showdown": "empty:",
		"angulartics": "empty:",
		"angularticsClicky": "empty:",
		"payment": "empty:"
		//"wysihtml": "empty:",
		//"rangy-core": "empty:"
	},
	waitSeconds: 120,
	throwWhen: {
		optimize: true
	}
})