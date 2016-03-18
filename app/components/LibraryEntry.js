var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');

var LibraryEntry = React.createClass({
    getInitialState: function() {
        return {displayNotification: false};
    },
    clearNotifications: function() {
        this.setState({displayNotification: false});
    },
    handleAdd: function() {
        this.setState({displayNotification: true});
        setTimeout(this.clearNotifications,2000);
        var songId = this.props.song.id;
        this.props.addToPlaylist(songId);
    },
    render: function() {
        var notificationMessage;
        if(this.state.displayNotification){
            notificationMessage = <div className="notification success">Added !</div>   
        }

        return (
                <li>
                    <div className="data">
                        <div className="title">
                            {this.props.song.title}
                        </div>
                        <div className="duration">
                            {utils.formatTime(this.props.song.duration)}
                        </div>
                    </div>
                    <div className="controls" id={"song-" + this.props.song.id}>
                        <div className="add control primary" onClick={this.handleAdd}>
                            <i className="fa fa-plus"></i>
                        </div>
                    </div>
                    <ReactCSSTransitionGroup transitionName="notified" transitionEnterTimeout={300} transitionLeaveTimeout={150}>
                        {notificationMessage}
                    </ReactCSSTransitionGroup>
                </li>
        );
    }
});

module.exports = LibraryEntry;
