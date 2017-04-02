import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import Main from './components/Main'
import LoggedinPage from './containers/LoggedinPage'
import LoginForm from './containers/LoginForm'
import User from './components/User'
import LibraryPage from './containers/LibraryPage'
import LibraryListSongPage from './containers/LibraryListSongPage'
import LibraryListArtistPage from './containers/LibraryListArtistPage'
import LibraryListWorkPage from './containers/LibraryListWorkPage'
import { createStore, applyMiddleware, compose } from 'redux'
import { apiMiddleware } from 'redux-api-middleware'
import { Provider } from 'react-redux'
import reducer from  './reducers'
import ReduxThunk from 'redux-thunk'
import persistState from 'redux-localstorage'
import apiJsonTokenMiddleware from './middleware/apiJsonToken'
import delayedActionMiddleware from './middleware/delayedActionMiddleware'

const store = createStore(
    reducer,
    compose(
        applyMiddleware(
            apiJsonTokenMiddleware,
            ReduxThunk,
            apiMiddleware,
            delayedActionMiddleware
        ),
        persistState('token')
    )
)

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Main}>
                <Route component={LoggedinPage}>
                    <IndexRedirect to="library" />
                    <Route path="library" component={LibraryPage}>
                        <IndexRedirect to="song" />
                        <Route path="song" component={LibraryListSongPage}/>
                        <Route path="artist" component={LibraryListArtistPage}/>
                        <Route path=":workType" component={LibraryListWorkPage}/>
                    </Route>
                    <Route path="user" component={User}/>
                </Route>
                <Route path="login" component={LoginForm} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('react-mounting-point')
)
