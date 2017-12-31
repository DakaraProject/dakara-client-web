import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Redirect, IndexRedirect, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import ReduxThunk from 'redux-thunk'
import persistState from 'redux-localstorage'
import Main from 'components/Main'
import LoggedinPage from 'components/navigation/LoggedinPage'
import Login from 'components/navigation/Login'
import Logout from 'components/navigation/Logout'
import User from 'components/user/User'
import UserEdit from 'components/settings/users/Edit'
import UserList from 'components/settings/users/List'
import Library from 'components/library/Library'
import LibrarySongList from 'components/library/song/List'
import LibraryArtistList from 'components/library/artist/List'
import LibraryWorkList from 'components/library/work/List'
import NotFound from 'components/navigation/NotFound'
import Forbidden from 'components/navigation/Forbidden'
import NotFoundRedirector from 'components/navigation/NotFoundRedirector'
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
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
                <Route component={LoggedinPage}>
                    <IndexRedirect to="library"/>
                    <Route path="library" component={Library}>
                        <IndexRedirect to="song"/>
                        <Route path="song" component={LibrarySongList}/>
                        <Route path="artist" component={LibraryArtistList}/>
                        <Route path=":workType" component={LibraryWorkList}/>
                    </Route>
                    <Route path="user" component={User}/>
                    <Route path="users" component={UserList}/>
                    <Route path="users/:userId" component={UserEdit}/>
                    <Route path="song-tags" component={SongTagList}/>
                    <Route path="403" component={Forbidden}/>
                </Route>
                <Route path="login" component={Login}/>
                <Route path="logout" component={Logout}/>
                <Route path="404" component={NotFound}/>
                <Route path="*" component={NotFoundRedirector}/>
            </Route>
        </Router>
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
