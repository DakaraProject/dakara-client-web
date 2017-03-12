import { CALL_API } from 'redux-api-middleware';

const apiJsonTokenMiddleware = ({getState, dispatch}) => next => action => {
    let call_api = action[CALL_API]

    if (call_api) {
        // Add header for token
        const token = getState().token
        if (token) {
            call_api.headers = {
                Authorization: 'Token ' + token,
                ...call_api.headers
            }
        }

        // Add header and body for JSON data
        const data = call_api.json
        if (data) {
            call_api.body = JSON.stringify(data),
            call_api.headers = {
                'Content-Type': 'application/json',
                ...call_api.headers
            }
            delete call_api.json
        }
    }

    return next(action)
}

export default apiJsonTokenMiddleware

