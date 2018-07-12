import { stringify } from 'query-string'

export const WEBSOCKET = "WEBSOCKET"
export const WEBSOCKET_PENDING = "WEBSOCKET_PENDING"
export const WEBSOCKET_OPEN = "WEBSOCKET_OPEN"
export const WEBSOCKET_CLOSE = "WEBSOCKET_CLOSE"
export const WEBSOCKET_LOST = "WEBSOCKET_LOST"

/**
 * Middleware generator for WebSocket connections
 * Process actions with `WEBSOCKET` key.
 *
 * This key contains the following:
 *   endpoint: websocket URI (relative);
 *   operation: websocket action ('connect', 'disconnect', 'send');
 *
 * Optional keys:
 *   event: object sent to the server through websocket, it will be converted to
 *     JSON. It must have a valid structure: `{type: "name", data: {key:
 *     "value"}}`. Mandatory for operation 'send'.
 *
 * You must dispatch a 'connect' operation beforehand of 'send' or 'disconnect'.
 *
 * If a token is present in the state, it will be send as authorization during the
 * 'connect' operation.
 *
 * On connect and on disconnect, `WEBSOCKET_OPEN` and `WEBSOCKET_CLOSE` actions
 * are dispatched. When connecting, the `WEBSOCKET_PENDING` action is
 * dispatched. When the connection is lost, the `WEBSOCKET_LOST` action is
 * dispatched.
 *
 * Received events through websocket are dispatched as normal Redux actions.
 * The translation between the event (websocket) type and the action type is
 * given in the `messageTypes` key of the config of the middleware generator.
 *
 * If the connection is abruptly closed, the middleware will try to reconnect it
 * within an interval defined in the `reconnectInterval` key of the config.
 *
 * Config to pass when generating the middleware:
 *   messageTypes: object with event type as key and action type as value;
 *   reconnectInterval: interval in ms before a reconnection attempt.
 */
export default (config={}) => ({getState, dispatch}) => {
    // pool of websocket connections
    // ordered as `endpoint: WebSocket object`
    const websocketPool = {}

    /*
     * Create the websocket connection
     */
    const connect = (endpoint) => {
        // add the token as query string for authentication
        // I know this is not really safe
        // this needs improvement/a complete new design
        const { token } = getState()
        let endpointAbsolute = getEndpointAbsolute(endpoint)
        if (token) endpointAbsolute += '?' + stringify({token})

        // dispatch an action
        dispatch({
            type: WEBSOCKET_PENDING,
            endpoint
        })

        const ws = new WebSocket(endpointAbsolute)

        /*
         * On open callback
         */
        ws.onopen = (e) => {
            console.debug('Opening WebSocket connection')

            // dispatch an action
            dispatch({
                type: WEBSOCKET_OPEN,
                endpoint
            })
        }

        /*
         * On close callback
         */
        ws.onclose = (e) => {
            // remove the connection from the websocket pool
            delete websocketPool[endpoint]

            // the connection was safely closed
            if (e.wasClean) {
                console.debug('Closing WebSocket connection')

                // dispatch an action
                dispatch({
                    type: WEBSOCKET_CLOSE,
                    endpoint,
                })

                return
            }

            // the connection was abruptly closed
            console.debug("WebSocket connection lost, reconnecting "
                + `in ${config.reconnectInterval / 1000} s`)

            // try to reconnect
            setTimeout(connect, config.reconnectInterval, endpoint)

            // dispatch an action
            dispatch({
                type: WEBSOCKET_LOST,
                endpoint,
            })
        }

        /*
         * On error callback
         */
        ws.onerror = (error) => {
            console.error(error)
        }

        /*
         * On message callback
         */
        ws.onmessage = (e) => {
            console.debug("Receiving message from server")

            // parse JSON string event
            let event
            try {
                event = JSON.parse(e.data)
            } catch (error) {
                console.error(`Error when parsing event received from server: ${error}`)
                return
            }

            // check the event type is known
            if (!Object.keys(config.messageTypes).includes(event.type)) {
                console.error(`Unknown event type to dispatch: ${event.type}`)
                return
            }

            // dispatch the event
            const { type, date, data } = event
            dispatch({
                type: config.messageTypes[type],
                date: new Date(date),
                data,
            })
        }

        // store the connection
        websocketPool[endpoint] = ws

        return ws
    }

    /*
     * Remove the websocket connection
     */
    const disconnect = (endpoint) => {
        checkConnected(endpoint)

        const ws = websocketPool[endpoint]
        ws.close()
    }

    /*
     * Send a message to the websocket
     */
    const send = (endpoint, event) => {
        checkConnected(endpoint)

        if (typeof event !== 'object') throw Error(
            "Event must be of type 'object'"
        )

        if (!Object.keys(event).includes('type')) throw Error(
            "Event must have a 'type' key"
        )

        const ws = websocketPool[endpoint]

        const message = JSON.stringify(event)

        console.debug("Sending message to server")
        ws.send(message)
    }

    /*
     * Check the endpoint is connected
     */
    const isConnected = (endpoint) => (
        Object.keys(websocketPool).includes(endpoint)
    )

    /*
     * Throw an error if the endpoint is not connected
     */
    const checkConnected = (endpoint) => {
        if (!isConnected(endpoint)) throw Error(`Endpoint ${endpoint} is not connected`)
    }

    /*
     * The actual middleware
     */
    return next => action => {
        let websocketAction = action[WEBSOCKET]

        if (typeof websocketAction === 'undefined') return next(action)

        /*
         * Extract params
         */
        const {endpoint, operation, event} = websocketAction

        /*
         * Check operation
         */
        switch (operation) {
            case "connect":
                connect(endpoint)
                break

            case "disconnect":
                disconnect(endpoint)
                break

            case "send":
                send(endpoint, event)
                break
        }
    }
}

/*
 * Get endpoint helper
 */
export const getEndpointAbsolute = (endpoint) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}${endpoint}`
}
