var React = require('react');
var utils = require('../dakara-utils');
var SongPreview = require('./SongPreview');
var SongView = require('./SongView');

var SongDisplay = React.createClass({
    getInitialState: function() {
        return {
            expanded: false
        }
    },

    handleExpand: function() {
        this.setState({expanded: true});
    },

    handleClose: function() {
        this.setState({expanded: false});
    },

    render: function() {
        var song = this.props.song;
        var songDisplay;
        if (this.state.expanded){
            songDisplay = (<SongView song={song} handleClose={this.handleClose}/>)    
        } else {
            songDisplay = (<SongPreview song={song} query={this.props.query} handleExpand={this.handleExpand}/>);
        }
        return (
                <div className="song-display">
                    {songDisplay}
                    <div className="duration">
                        <div className="duration-content">
                            {utils.formatDuration(song.duration)}
                        </div>
                    </div>
                </div>
            )
    }
});

module.exports = SongDisplay;
