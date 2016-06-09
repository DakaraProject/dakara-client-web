var React = require('react');
var utils = require('../dakara-utils');
var SongPreviewDetails = require('./SongPreviewDetails');
var SongTagList = require('./SongTagList');
var Highlighter = require('react-highlight-words').default;

var SongPreview = React.createClass({
    render: function() {
        var song = this.props.song;

        return (
                <div className="song-preview">
                    <SongTagList tags={song.tags} />
                    <div className="title">
                        <Highlighter
                            highlightClassName='highlight'
                            searchWords={this.props.query.titles.concat(
                                    this.props.query.remaining
                                    )}
                            textToHighlight={song.title}
                        />
                    </div>
                    <SongPreviewDetails song={song} query={this.props.query}/>
                    <div className="duration">
                        {utils.formatDuration(song.duration)}
                    </div>
                </div>
            )
    }
});

module.exports = SongPreview;
