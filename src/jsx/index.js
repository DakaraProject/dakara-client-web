import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Redirect, IndexRedirect, browserHistory } from 'react-router'
import Main from './containers/Main'
import LoggedinPage from './containers/LoggedinPage'
import LoginForm from './containers/LoginForm'
import LogoutPage from './containers/LogoutPage'
import UserPage from './containers/UserPage'
import UserEditPage from './containers/UserEditPage'
import UsersPage from './containers/UsersPage'
import LibraryPage from './containers/LibraryPage'
import LibraryListSongPage from './containers/LibraryListSongPage'
import LibraryListArtistPage from './containers/LibraryListArtistPage'
import LibraryListWorkPage from './containers/LibraryListWorkPage'
import NotFound from './components/NotFound'
import Forbidden from './components/Forbidden'
import NotFoundRedirector from './components/NotFoundRedirector'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import reducer from  './reducers'
import ReduxThunk from 'redux-thunk'
import persistState from 'redux-localstorage'
import fetchApiMiddleware from './middleware/fetchApi'
import delayMiddleware from './middleware/delay'
import { logout, setToken } from './actions'

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
                    <Route path="library" component={LibraryPage}>
                        <IndexRedirect to="song"/>
                        <Route path="song" component={LibraryListSongPage}/>
                        <Route path="artist" component={LibraryListArtistPage}/>
                        <Route path=":workType" component={LibraryListWorkPage}/>
                    </Route>
                    <Route path="user" component={UserPage}/>
                    <Route path="users" component={UsersPage}/>
                    <Route path="users/:userId" component={UserEditPage}/>
                    <Route path="403" component={Forbidden}/>
                </Route>
                <Route path="login" component={LoginForm}/>
                <Route path="logout" component={LogoutPage}/>
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
