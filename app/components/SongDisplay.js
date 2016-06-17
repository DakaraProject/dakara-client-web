var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');
var SongPreview = require('./SongPreview');
var SongView = require('./SongView');

var SongDisplay = React.createClass({

    render: function() {
        var song = this.props.song;
        var songView;
        var songPreview;
        if (this.props.expanded){
            songView = (<SongView song={song} handleClose={this.props.handleClose} setSearch={this.props.setSearch}/>)    
        } else {
            songPreview = (<SongPreview song={song} query={this.props.query} handleExpand={this.props.handleExpand}/>);
        }
        return (
                <div className="song-display">
                    <ReactCSSTransitionGroup transitionName="expand-view" transitionEnterTimeout={600} transitionLeaveTimeout={300}>
                        {songView}
                    </ReactCSSTransitionGroup>
                    <ReactCSSTransitionGroup transitionName="expand-preview" transitionEnterTimeout={300} transitionLeaveTimeout={1}>
                        {songPreview}
                    </ReactCSSTransitionGroup>
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
