import { CALL_API } from 'redux-api-middleware'

/**
 * Middleware for easy manipulation of the API Middleware.
 * It adds a token in the header if a token is defined in the store (so, the
 * login request will go without it).
 * It adds also a support for JSON data passed as object. The object is
 * converted into string and an appropriate header for content type is added.
 * It adds a meta to the types.
 */
const apiJsonTokenMiddleware = ({getState, dispatch}) => next => action => {
    let call_api = action[CALL_API]

    if (call_api) {
        // add header for token
        const token = getState().token
        if (token) {
            call_api.headers = {
                Authorization: 'Token ' + token,
                ...call_api.headers
            }
        }

        // add header and body for JSON data
        const data = call_api.json
        if (data) {
            call_api.body = JSON.stringify(data),
            call_api.headers = {
                'Content-Type': 'application/json',
                ...call_api.headers
            }

            // delete the `json` key so as the API Middleware to get correct
            // inputs
            delete call_api.json
        }

        // set a common meta to types without meta before
        const meta = call_api.meta
        if (meta) {
            const newTypes = call_api.types.map((type) => {
                // if the meta is allready an object
                if (type instanceof Object) {
                    return { ...type, meta: { ...meta, ...type.meta }}
                }

                return { type, meta }
            })

            // replace `type` and delete the `meta` key so as the API Middleware
            // to get correct inputs
            call_api.types = newTypes
            delete call_api.meta
        }
    }

    return next(action)
}

export default apiJsonTokenMiddleware
