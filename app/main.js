var $ = jQuery = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var utils = require('./dakara-utils');
var Dakara = require('./components/Dakara');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var browserHistory = require('react-router').browserHistory;

require("../less/dakara.less");

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


