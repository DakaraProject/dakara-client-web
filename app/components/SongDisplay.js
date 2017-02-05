var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');
var SongPreview = require('./SongPreview');
var SongExpandedDetails = require('./SongExpandedDetails');

var SongDisplay = React.createClass({

    render: function() {
        var song = this.props.song;
        var songExpandedDetails;
        if (this.props.expanded){
            songExpandedDetails = (<SongExpandedDetails song={song} />)
        }

        var songPreview = (<SongPreview
                                song={song}
                                query={this.props.query}
                                handleExpand={this.props.handleExpand}
                                expanded={this.props.expanded}
                            />);
        return (
                <div className="entry-info">
                    <div className="song-view">
                        {songPreview}
                        <ReactCSSTransitionGroup
                            component="div"
                            transitionName="expand-view"
                            transitionEnterTimeout={600}
                            transitionLeaveTimeout={300}
                        >
                            {songExpandedDetails}
                        </ReactCSSTransitionGroup>
                    </div>
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
