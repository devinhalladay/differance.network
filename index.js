var css = require('sheetify')
var choo = require('choo')
require("babel-core/register");
require("babel-polyfill");


css('tachyons')

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
} else {
  app.use(require('choo-service-worker')())
}

app.use(require('./stores/store'))

app.route('/', require('./views/main'))
app.route('/:root', require('./views/page'))
// app.route('/*', require('./views/404'))

module.exports = app.mount('body')
