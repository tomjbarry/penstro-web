setx NODE_ENV "production"
setx NODE_SUB_ENV "production"
node r.js -o inline.build.js
node r.js -o app.build.js
node main.js