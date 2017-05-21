import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Redirect, IndexRedirect, browserHistory } from 'react-router'
import Main from './components/Main'
import LoggedinPage from './containers/LoggedinPage'
import LoginForm from './containers/LoginForm'
import LogoutPage from './containers/LogoutPage'
import User from './components/User'
import LibraryPage from './containers/LibraryPage'
import LibraryListSongPage from './containers/LibraryListSongPage'
import LibraryListArtistPage from './containers/LibraryListArtistPage'
import LibraryListWorkPage from './containers/LibraryListWorkPage'
import NotFound from './components/NotFound'
import NotFoundRedirector from './components/NotFoundRedirector'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import reducer from  './reducers'
import ReduxThunk from 'redux-thunk'
import persistState from 'redux-localstorage'
import fetchApiMiddleware from './middleware/fetchApi'
import delayMiddleware from './middleware/delay'

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
                    <Route path="user" component={User}/>
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
