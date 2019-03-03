var html = require('choo/html')

var TITLE = 'Channel Name Here'

module.exports = view

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)
  return html `
    <body class="sans-serif pa3">
      <h1>${state.params.root}</h1>
    </body>
  `
}