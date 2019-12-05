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
import SettingsUsersEdit from 'components/settings/users/Edit'
import SettingsUsersList from 'components/settings/users/List'
import SettingsSongTagsList from 'components/settings/song_tags/List'
import SettingsKaraStatus from 'components/settings/KaraStatus'
import SettingsKaraDateStop from 'components/settings/KaraDateStop'
import LibraryList from 'components/library/List'
import Playlist from 'components/playlist/List'
import PlaylistPlayed from 'components/playlist/PlayedList'
import NotFound from 'components/navigation/NotFound'
import reducer from  'reducers'
import fetchApiMiddleware from 'middleware/fetchApi'
import delayMiddleware from 'middleware/delay'
import { logout, setToken } from 'actions/token'

import './scss/main.scss'

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
                    <ProtectedRoute exact path="/library/:libraryType" component={LibraryList}/>
                    <Redirect exact from="/library" to="/library/song"/>
                    <ProtectedRoute exact path="/playlist/queueing" component={Playlist}/>
                    <ProtectedRoute exact path="/playlist/played" component={PlaylistPlayed}/>
                    <Redirect exact from="/playlist" to="/playlist/queueing"/>
                    <ProtectedRoute exact path="/user" component={User}/>
                    <ProtectedRoute exact path="/settings/users/:userId" component={SettingsUsersEdit}/>
                    <ProtectedRoute exact path="/settings/users" component={SettingsUsersList}/>
                    <ProtectedRoute exact path="/settings/song-tags" component={SettingsSongTagsList}/>
                    <ProtectedRoute exact path="/settings/kara-status" component={SettingsKaraStatus}/>
                    <ProtectedRoute exact path="/settings/kara-date-stop" component={SettingsKaraDateStop}/>
                    <Redirect exact from="/settings" to="/settings/users"/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/logout" component={Logout}/>
                    <Redirect exact from="/" to="/library"/>
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
