/**
 * Middleware for handling delayed actions requested by a `meta.delayedAction` field.
 * The corresponding key must be an object with the corresponding keys:
 *     `action`: an action to perform,
 *     `delay`: the delay in milliseconds before the passed `action` is
 *          dispatched.
 */
const delayedActionMiddleware = ({getState, dispatch}) => next => action => {
    const meta = action.meta
    if (meta) {
        const delayedAction = meta.delayedAction
        if (delayedAction) {
            setTimeout(
                () => {
                    next(delayedAction.action)
                },
                delayedAction.delay
            )
        }
    }

    return next(action)
}

export default delayedActionMiddleware
