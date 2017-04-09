import {sprintf} from 'sprintf-js';

export default {
    formatHourTime: function(timestamp) {
        var date = new Date(timestamp);
        return sprintf("%02d:%02d",date.getHours(), date.getMinutes());
    },

    formatTime: function(seconds) {
        var hours = Math.floor(seconds / 3600);
        var remaining = seconds % 3600;
        var minsec = sprintf("%02d:%02d", Math.floor(remaining / 60), remaining % 60);
        return (hours == 0 ? '' : (hours + ":")) + minsec;
    },

    formatDuration: function(seconds) {
        var hours = Math.floor(seconds / 3600);
        var remaining = seconds % 3600;
        var minsec = sprintf("%01d:%02d", Math.floor(remaining / 60), remaining % 60);
        return (hours == 0 ? '' : (hours + ":")) + minsec;
    },

    params: {
        baseUrl: "/api/",
        pollInterval: 1000
    }
}
