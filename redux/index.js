import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import AppPage from './containers/AppPage'
import LoginForm from './containers/LoginForm'
import User from './components/User'
import LibraryPage from './containers/LibraryPage'
import SongPageList from './containers/SongPageList'
import ArtistsPageList from './containers/ArtistsPageList'
import WorksPageList from './containers/WorksPageList'
import { createStore, applyMiddleware, compose } from 'redux'
import { apiMiddleware } from 'redux-api-middleware'
import { Provider } from 'react-redux'
import reducer from  './reducers'
import ReduxThunk from 'redux-thunk'
import persistState from 'redux-localstorage'
import apiJsonTokenMiddleware from './middleware/apiJsonToken'

const store = createStore(
    reducer,
    compose(
        applyMiddleware(
            apiJsonTokenMiddleware,
            ReduxThunk,
            apiMiddleware
        ),
        persistState('token')
    )
)

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={AppPage}>
                <IndexRedirect to="library" />
                <Route path="library" component={LibraryPage}>
                    <IndexRedirect to="songs" />
                    <Route path="songs" component={SongPageList}/>
                    <Route path="artists" component={ArtistsPageList}/>
                    <Route path=":workType" component={WorksPageList}/>
                </Route>
                <Route path="user" component={User}/>
            </Route>
            <Route path="/login" component={LoginForm} />
        </Router>
    </Provider>,
    document.getElementById('content')
)
