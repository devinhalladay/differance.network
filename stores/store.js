module.exports = store

const apiInit = { method: 'GET',
               mode: 'cors',
               cache: 'no-cache' };
const baseURL = 'https://api.are.na/v2/'

const itemsPerPage = 50


function getLastDirFromURL() {
  let loc = window.location.href;
  loc = loc.lastIndexOf('/') == loc.length - 1 ? loc.substr(0, loc.length - 1) : loc.substr(0, loc.length + 1);
  let targetValue = loc.substr(loc.lastIndexOf('/') + 1);
  console.log(targetValue);
  return targetValue
}

function store(state, emitter) {
    emitter.on('DOMContentLoaded', function () {
      emitter.on('initDiptych', initializeDiptych)
        emitter.on('navigate', grabArenaContent)

    }) //DOMContentLoaded


    function grabArenaContent() {
      state.RESPONSE_ERR = false
      state.CONTENT_LOADING = true
      emitter.emit(state.events.RENDER)

      let rootChanSlug = state.params.root
      let contentChanSlug = state.href == '/' ? rootChanSlug : getLastDirFromURL()

      // console.log('VARS', rootChanSlug, contentChanSlug)

      let rootIsContentChan = rootChanSlug == contentChanSlug ? true : false

      if (Object.keys(state.rootInfo).length === 0 && state.rootInfo.constructor === Object) {
        setRootInfo(rootChanSlug, rootIsContentChan)
      }

      initializeDiptych(contentChanSlug)

    }



    async function setRootInfo(rootChanSlug, isContentChan) {
      try {
        let basePath = 'channels/' + rootChanSlug
        let baseData = await apiCall(basePath)
        let channelsPath = basePath + '/search?subject=channel'
        let channelsData = await apiCall(channelsPath)

        console.log('CHANNELS', channelsData.channels)

        state.rootInfo = {
          id: baseData.id,
          channels: channelsData.channels,
          desc: baseData.metadata ? baseData.metadata.description : '',
          status: baseData.status,
          title: baseData.title,
          slug: baseData.slug
        }

        emitter.emit(state.events.RENDER)

        // EVENTUALLY reuse root api call to set content, if content is the root chan
        // if (isContentChan) {
        //     initializePageContent(rootChanSlug)
        // }

      } catch (err) {
        state.RESPONSE_ERR = true
        state.CONTENT_LOADING = false
        emitter.emit(state.events.RENDER)
      }
    }



    async function initializePageContent(contentChanSlug, chanLength) {
      try {
        let contentChanLength = chanLength || (await apiCall('channels/' + contentChanSlug)).length

        state.totalPages = Math.ceil(contentChanLength / itemsPerPage)
        state.currPage = state.totalPages

        let contentPath = 'channels/' + contentChanSlug
        let iniPage = state.currPage
        let iniContents = await apiCall(contentPath, {
          page: 1,
          per: 25
        })

        // FIX FOR WHEN LAST PAGE IS SUPER SHORT

        let contentBlocks = iniContents.contents.reverse()

        //set the content of the page
        state.pageContent = {
          title: iniContents.title,
          slug: iniContents.slug,
          blocks: contentBlocks,
          source_id: iniContents.id
        }

        // ALL CONTENT LOADED, RENDER THE PAGE
        emitter.emit(state.events.RENDER);

      } catch (err) {
        emitter.emit(state.events.RENDER)
      }
    } // initializePageContent


    // function apiCall() {
    //   return fetch('https://api.are.na/v2/channels/liquid-disintegration', apiInit).then((response) => {
    //       return response.text()
    //     })
    // }

    function apiCall(path, params) {
      let endpoint = baseURL + path
      if (params) {
        let pageNumber = params.page ? params.page : 1
        let pageLength = params.per ? params.per : 25
        endpoint = endpoint + "?page=" + pageNumber + "&amp;per=" + pageLength
      }
      return fetch(endpoint, apiInit)
        .then((response) => {
          return response.json()
        })
    }


    function initializeDiptych(chanURL) {
        let channelSlug
        //check if value is URL, if it is, get slug from URL, if not, issa slug
        if (chanURL && chanURL.indexOf('/') >= 0) {
            channelSlug = chanURL.substr(chanURL.lastIndexOf('/') + 1)
        //if not a URL, input is channel Slug
        } else { channelSlug = chanURL }
        // show loader and update the browser URL
        
        emitter.emit('pushState', `${channelSlug}/`)
        emitter.emit(state.events.RENDER)
    } // initializeNewSite


    // function apiCall(path, params) {
    //     let endpoint = baseURL + path
    //     if (params) {
    //         let pageNumber = params.page ? params.page : 1
    //         let pageLength = params.per ? params.per : 25
    //         endpoint = endpoint + "?page=" +pageNumber + "&amp;per=" +pageLength
    //     }
    //     return fetch(endpoint, apiInit)
    //         .then((response) => {
    //             return response.json()
    //         })
    // }
  }