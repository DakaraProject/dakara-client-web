/**
 * MiddleWare to delay actions
 * actions with a "delay" key will be delayed by the value of this key in ms
 */
const delayMiddleware = ({getState, dispatch}) => next => action => {
    const delay = action.delay

    if (typeof delay === 'undefined') {
        return next(action)
    }

    delete action.delay
    setTimeout(() => next(action), delay)
}

export default delayMiddleware
