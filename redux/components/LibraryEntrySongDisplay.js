import React, { Component } from 'react'
import utils from '../utils'
import LibraryEntrySongPreview from './LibraryEntrySongPreview'

export default class LibraryEntrySongDisplay extends Component {
    render() {
        var song = this.props.song
        var songPreview = (<LibraryEntrySongPreview
                                song={song}
                                query={this.props.query}
                                handleClick={this.props.handleClick}
                                expanded={this.props.expanded}
                            />)

        return (
                <div className="library-entry-song-display">
                    {songPreview}
                    <div className="duration">
                        {utils.formatDuration(song.duration)}
                    </div>
                </div>
            )
    }
}
