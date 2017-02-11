var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');
var PlaylistEntry = require('./PlaylistEntry');

var Playlist = React.createClass({
    handleCollapse: function() {
        this.setState({collapsed: !this.state.collapsed, expandedId: null});
    },
    getInitialState: function() {
        return {
            collapsed: true,
            expandedId: null
        };
    },

    setExpandedId: function(id) {
        this.setState({expandedId: id});
    },

    render: function() {
        var currentTime = new Date().getTime();
        var list = this.props.entries.results;
        var playlistContent;
        var next;
        // compute time remaing for currently playing song
        var remainingTime = 0;
        var playerStatus = this.props.playerStatus;
        if (playerStatus.playlist_entry) {
            remainingTime = playerStatus.playlist_entry.song.duration - playerStatus.timing;
        }

        //compute time when each song is going to be played
        var timeOfPlay = {};
        for(var entry of list){
            timeOfPlay[entry.id] = currentTime + remainingTime * 1000;
            remainingTime += +(entry.song.duration);
        }
        var playListEndTime = currentTime + remainingTime * 1000;

        if (!this.state.collapsed){
            var removeEntry = this.props.removeEntry;
            var playlistEntries = list.map(function(entry) {
                return ( <PlaylistEntry
                            key={entry.id}
                            entry={entry}
                            timeOfPlay={timeOfPlay[entry.id]}
                            removeEntry={removeEntry}
                            setExpandedId={this.setExpandedId}
                            expanded={this.state.expandedId == entry.id}
                        /> );
            }.bind(this));
            playlistContent = (
                <ReactCSSTransitionGroup
                    component="ul"
                    id="playlist-entries"
                    className="listing"
                    transitionName="add-remove"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={650}
                >
                    {playlistEntries}
                </ReactCSSTransitionGroup>
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
        var endingInfo;
        if (list.length != 0 || playerStatus.playlist_entry) { 
            endingInfo = (
                <div className="info-item">
                    <span className="stat">{utils.formatHourTime(playListEndTime)}</span>
                    <span className="description">Ending<br/>time</span>
                </div>
                );
        }

        var playlistSize = this.props.entries.count;

        return (
        <div id="playlist">
            <ReactCSSTransitionGroup
                component="div"
                className="playlist-collapse-content"
                transitionName="collapse"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={150}
            >
                {playlistContent}
            </ReactCSSTransitionGroup>
            <div className="info" onClick={this.handleCollapse}> 
                <div className="info-item">
                    <span className="stat">{playlistSize}</span>
                    <span className="description">song{playlistSize == 1? '': 's'}<br/>in playlist</span>
                </div>
                {next}
                {endingInfo}
            </div>
        </div>
        );
    }
});

module.exports = Playlist;
