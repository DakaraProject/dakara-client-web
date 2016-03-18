var sprintf = require('sprintf-js').sprintf;

var DakaraUtils = {
    getCookie: function(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    },

    formatTime: function(seconds) {
        var hours = Math.floor(seconds / 3600);
        var remaining = seconds % 3600;
        var minsec = sprintf("%02d:%02d", Math.floor(remaining / 60), remaining % 60);
        return (hours == 0 ? '' : (hours + ":")) + minsec;
    }
}

module.exports = DakaraUtils;
