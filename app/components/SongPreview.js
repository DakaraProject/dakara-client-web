var React = require('react');
var utils = require('../dakara-utils');
var SongPreviewDetails = require('./SongPreviewDetails');
var SongTagList = require('./SongTagList');

var SongPreview = React.createClass({
    render: function() {
        var song = this.props.song;

        return (
                <div className="song-preview">
                    <SongTagList tags={song.tags} />
                    <div className="title">
                        {song.title}
                    </div>
                    <SongPreviewDetails song={song} />
                    <div className="duration">
                        {utils.formatDuration(song.duration)}
                    </div>
                </div>
            )
    }
});

module.exports = SongPreview;
