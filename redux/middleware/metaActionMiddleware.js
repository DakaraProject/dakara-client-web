/**
 * Middleware for dispatching additional actions from action with a
 * `meta.action` field containing action to dispatch.
 * Also accept delayed actions requested by a `meta.delayedAction` field
 * containing an object with the corresponding keys:
 *     `action`: an action to perform,
 *     `delay`: the delay in milliseconds before the passed `action` is
 *          dispatched.
 */
const metaActionMiddleware = ({getState, dispatch}) => next => action => {
    const meta = action.meta
    if (meta) {
        const { delayedAction, action } = meta
        if (delayedAction) {
            setTimeout(
                () => {
                    dispatch(delayedAction.action)
                },
                delayedAction.delay
            )
        }

        if (action) {
            dispatch(action)
        }
    }

    return next(action)
}

export default metaActionMiddleware
