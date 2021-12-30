import { logout, setToken } from 'actions/token'

/**
 * Multi tabs events handling
 *
 * Synchronizes the connected state between different tabs
 */
const manageStorageEvent = (store) => {
    window.addEventListener(
        'storage',
        ({ key, oldValue, newValue }) => {
            // check if the storage event is on the requested key
            if (key !== 'redux') {
                return
            }

            // check if there is a token in `oldValue` and not `newValue`
            const oldValueObj = JSON.parse(oldValue)
            const newValueObj = JSON.parse(newValue)

            if (oldValueObj.token && !newValueObj.token) {
                store.dispatch(logout())
            }

            if (!oldValueObj.token && newValueObj.token) {
                store.dispatch(setToken(newValueObj.token))
            }
        },
        false
    )
}

export default manageStorageEvent
