var html = require('choo/html')

var TITLE = 'differance.network - main'

module.exports = view

function view (state, emit) {
  let channelSlug

  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="code lh-copy">
      <input onchange=${handleFormSubmit}>
    </body>
  `

  function handleFormSubmit (e) {
    emit('initDiptych', e.currentTarget.value)
  }
}