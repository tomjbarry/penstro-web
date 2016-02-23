({
	baseUrl:"./public",
	removeCombined: true,
	name: "inline/browser-fixes",
	out: "public/inline/browser-fixes.min.js",
	optimize: "uglify",
	paths: {},
	skipModuleInsertion: true,
	throwWhen: {
		optimize: true
	}
})