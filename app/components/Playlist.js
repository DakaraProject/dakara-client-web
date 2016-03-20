var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');
var PlaylistEntry = require('./PlaylistEntry');

var Playlist = React.createClass({
    handleCollapse: function() {
        this.setState({collapsed: !this.state.collapsed});
    },
    getInitialState: function() {
        return {collapsed: true};
    },

    render: function() {
        var playingId = this.props.playingId; 
        var list = this.props.entries.results;
        var playlistContent;
        var next;
        var playlistDuration = 0;
        for(entry of list){
            playlistDuration += +(entry.song.duration);
        }

        if (!this.state.collapsed){
            var removeEntry = this.props.removeEntry;
            var playlistEntries = list.map(function(entry) {
                return ( <PlaylistEntry key={entry.id} entry={entry} removeEntry={removeEntry}/> );
            });
            playlistContent = (
                <ul className="listing">
                    <ReactCSSTransitionGroup transitionName="add-remove" transitionEnterTimeout={300} transitionLeaveTimeout={650}>
                        {playlistEntries}
                    </ReactCSSTransitionGroup>
                </ul>
                )
        } 
        if (list[0]){
            next = (
                <div className="info-item">
                    <span className="stat">Next</span>
                    <span className="description">{list[0].song.title}</span>
                </div>
            );
        }
        
        var playlistSize = this.props.entries.count;

        return (
        <div id="entries">
            <ReactCSSTransitionGroup transitionName="collapse" transitionEnterTimeout={300} transitionLeaveTimeout={150}>
                {playlistContent}
            </ReactCSSTransitionGroup>
            <div className="info" onClick={this.handleCollapse}> 
                <div className="info-item">
                    <span className="stat">{playlistSize}</span>
                    <span className="description">song{playlistSize == 1? '': 's'}<br/>in playlist</span>
                </div>
                {next}
                <div className="info-item">
                    <span className="stat">{utils.formatTime(playlistDuration)}</span>
                    <span className="description">of songs<br/>remaining</span>
                </div>
            </div>
        </div>
        );
    }
});

module.exports = Playlist;
