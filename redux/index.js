import React from 'react';
import ReactDOM from 'react-dom';
import AppPage from './containers/AppPage';
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
        <AppPage />
    </Provider>,
    document.getElementById('content')
);
