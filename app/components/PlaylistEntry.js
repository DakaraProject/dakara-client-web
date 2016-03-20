var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');

var PlaylistEntry = React.createClass({
    getInitialState: function() {
        return {displayNotification: false};
    },
    remove: function () {
        this.props.removeEntry(this.props.entry.id, this.clearNotification);
    },
    clearNotification: function() {
        this.setState({displayNotification: false});
    },
    handleRemove: function(e){
        this.setState({displayNotification: true});
        setTimeout(this.remove, 500);
    },

    render: function(){
        var notificationMessage;
        if(this.state.displayNotification){
            notificationMessage = <div className="notification danger">Deleted !</div>
        }
        return (
            <li>
                <div className="data">
                    <div className="title">
                        {this.props.entry.song.title}
                    </div>
                    <div className="duration">
                        {utils.formatTime(this.props.entry.song.duration)}
                    </div>
                </div>
                <div className="controls">
                    <div className="remove control danger" onClick={this.handleRemove}>
                        <i className="fa fa-times"></i>
                    </div>
                </div>
                <ReactCSSTransitionGroup transitionName="notified" transitionEnterTimeout={300} transitionLeaveTimeout={150}>
                    {notificationMessage}
                </ReactCSSTransitionGroup>
            </li>
        );
    }
});

module.exports = PlaylistEntry;
