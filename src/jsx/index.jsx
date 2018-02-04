import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import ReduxThunk from 'redux-thunk'
import persistState from 'redux-localstorage'
import Main from 'components/Main'
import { ProtectedRoute } from 'components/generics/Router'
import Login from 'components/navigation/Login'
import Logout from 'components/navigation/Logout'
import User from 'components/user/User'
import UserEdit from 'components/settings/users/Edit'
import UserList from 'components/settings/users/List'
import Library from 'components/library/Library'
import LibraryList from 'components/library/List'
import NotFound from 'components/navigation/NotFound'
import SongTagList from 'components/settings/song_tags/List'
import reducer from  'reducers'
import fetchApiMiddleware from 'middleware/fetchApi'
import delayMiddleware from 'middleware/delay'
import { logout, setToken } from 'actions'

const store = createStore(
    reducer,
    compose(
        applyMiddleware(
            fetchApiMiddleware,
            ReduxThunk,
            delayMiddleware
        ),
        persistState('token')
    )
)

export const defaultPathname = "/library/song"

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Main>
                <Switch>
                    <ProtectedRoute path="/library/:libraryType" component={LibraryList}/>
                    <Redirect from="/library" to="/library/song"/>
                    <ProtectedRoute path="/user" component={User}/>
                    <ProtectedRoute path="/users/:userId" component={UserEdit}/>
                    <ProtectedRoute path="/users" component={UserList}/>
                    <ProtectedRoute path="/song-tags" component={SongTagList}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/logout" component={Logout}/>
                    <Redirect from="/" to="/library"/>
                    <Route component={NotFound}/>
                </Switch>
            </Main>
        </BrowserRouter>
    </Provider>,
    document.getElementById('react-mounting-point')
)

/**
 * Multi tabs events handling
 *
 * Synchronizes the connected state between different tabs
 */
function handleStorageEvent({ key, oldValue, newValue }) {
    // check if the storage event is on the requested key
    if (key != 'redux') {
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
}

window.addEventListener('storage', handleStorageEvent, false)
