var $ = jQuery = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var utils = require('./dakara-utils');
var PlayerBox = require('./components/PlayerBox');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var hashHistory = require('react-router').hashHistory;

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
    <Router history={hashHistory}>
        <Route path="/" component={PlayerBox}/>
    </Router>
    ,
    document.getElementById('content')
);


