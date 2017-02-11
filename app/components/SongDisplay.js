import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import utils from '../dakara-utils';
import SongPreview from './SongPreview';
import SongExpandedDetails from './SongExpandedDetails';

export default class SongDisplay extends React.Component {

    render() {
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
}
