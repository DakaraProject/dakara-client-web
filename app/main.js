import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import utils from './dakara-utils';
import Dakara from './components/Dakara';
import {Router, Route, browserHistory} from 'react-router';

var csrftoken = utils.getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={Dakara}/>
    </Router>
    ,
    document.getElementById('content')
);


