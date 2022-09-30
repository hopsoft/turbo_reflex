import activity from './activity'

const events = {
  beforeStart: 'turbo-reflex:before-start',
  start: 'turbo-reflex:start',
  success: 'turbo-reflex:success',
  finish: 'turbo-reflex:finish',
  abort: 'turbo-reflex:abort',
  clientError: 'turbo-reflex:client-error',
  serverError: 'turbo-reflex:server-error',
  missingFrame: 'turbo-reflex:missing-frame',
  missingFrameSrc: 'turbo-reflex:missing-frame-src'
}

function dispatch (name, target = document, detail = {}, raise = false) {
  try {
    target = target || document
    const event = new CustomEvent(name, {
      detail,
      cancelable: false,
      bubbles: true
    })
    target.dispatchEvent(event)
  } catch (error) {
    if (raise) throw error
    dispatch(events.clientError, target, { error, ...detail }, true)
  }
}

function finish (event) {
  event.detail.endedAt = new Date().getTime()
  event.detail.milliseconds = event.detail.endedAt - event.detail.startedAt
  setTimeout(() => dispatch(events.finish, event.target, event.detail), 10)
}

addEventListener(events.serverError, finish)
addEventListener(events.success, finish)
addEventListener(events.missingFrame, finish)
addEventListener(events.missingFrameSrc, finish)
addEventListener(events.finish, event => activity.remove(event.detail.id), true)

export default {
  dispatch,
  events
}