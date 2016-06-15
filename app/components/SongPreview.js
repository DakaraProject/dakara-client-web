var React = require('react');
var SongPreviewDetails = require('./SongPreviewDetails');
var SongTagList = require('./SongTagList');
var Highlighter = require('react-highlight-words').default;

var SongPreview = React.createClass({
    handleExpand: function() {
        this.props.handleExpand(); 
    },

    render: function() {
        var song = this.props.song;
        var title;
        if (this.props.query != undefined) {
            title = (
                        <Highlighter
                            highlightClassName='highlight'
                            searchWords={this.props.query.titles.concat(
                                    this.props.query.remaining
                                    )}
                            textToHighlight={song.title}
                        />
                    )
        } else {
            title = song.title
        }

        return (
                <div className="song-preview" onClick={this.handleExpand}>
                    <SongTagList tags={song.tags} />
                    <div className="title">{title}</div>
                    <SongPreviewDetails song={song} query={this.props.query}/>
                </div>
            )
    }
});

module.exports = SongPreview;
