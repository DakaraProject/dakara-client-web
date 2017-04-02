import React, { Component } from 'react'
import utils from '../utils'
import LibraryEntrySongPreview from './LibraryEntrySongPreview'

export default class SongDisplay extends Component {
    render() {
        var song = this.props.song
        var songPreview = (<LibraryEntrySongPreview
                                song={song}
                                query={this.props.query}
                            />)
                                // handleExpand={this.props.handleExpand}
                                // expanded={this.props.expanded}

        return (
                <div className="song-display entry-info">
                    <div className="song-view">
                        {songPreview}
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
