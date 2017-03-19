import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import AppPage from './containers/AppPage';
import LoginForm from './containers/LoginForm';
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
            <Route path="/" component={AppPage} />
            <Route path="/login" component={LoginForm} />
        </Router>
    </Provider>,
    document.getElementById('content')
)
