var React = require('react');
var utils = require('../dakara-utils');
var SongPreview = require('./SongPreview');
var SongView = require('./SongView');

var SongDisplay = React.createClass({
    handleExpand: function() {
        this.props.setExpendedId(this.props.song.id);
    },

    handleClose: function() {
        this.props.setExpendedId(null);
    },

    render: function() {
        var song = this.props.song;
        var songDisplay;
        if (this.props.expanded){
            songDisplay = (<SongView song={song} handleClose={this.handleClose} setSearch={this.props.setSearch}/>)    
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
