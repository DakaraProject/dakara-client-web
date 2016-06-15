var React = require('react');
var utils = require('../dakara-utils');
var SongPreview = require('./SongPreview');

var SongDisplay = React.createClass({
    render: function() {
        var song = this.props.song;
        return (
                <div className="song-display">
                    <SongPreview song={song} query={this.props.query}/>
                    <div className="duration">
                        {utils.formatDuration(song.duration)}
                    </div>
                </div>
            )
    }
});

module.exports = SongDisplay;
