var $ = jQuery = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var utils = require('./dakara-utils');
var PlayerBox = require('./components/PlayerBox');

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
    <PlayerBox url="/" pollInterval={1000}/>,
    document.getElementById('content')
);


