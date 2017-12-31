import React, { Component } from 'react'
import Highlighter from 'react-highlight-words'
import utils from 'utils'
import SongPreviewDetails from './SongPreviewDetails'
import SongTagList from './SongTagList'

export default class SongPreview extends Component {
    render() {
        const song = this.props.song

        /**
         * Song title
         * highlighted with search query
         */

        let title
        if (this.props.query != undefined) {
            title = (
                        <Highlighter
                            className="title"
                            searchWords={this.props.query.title.contains.concat(
                                    this.props.query.remaining
                                    )}
                            textToHighlight={song.title}
                            autoEscape
                        />
                    )
        } else {
            title = (<span className="title">{song.title}</span>)
        }

        /**
         * Song version
         */

        let version
        if (song.version) {
            version = (<span className="version">{song.version} version</span>)
        }

        /**
         * Tags and SongPreviewDetails
         * SongPreviewDetails contains highlighted artists and works info
         */

        let tags
        let songPreviewDetails
        if (!this.props.expanded) {
            tags = (
                <SongTagList
                    tags={song.tags}
                    query={this.props.query}
                    unclickable={true}
                />
            )

            songPreviewDetails = (<SongPreviewDetails song={song} query={this.props.query}/>)
        }

        /**
         * Display duration conditionally
         */
        let duration
        if (!this.props.noDuration) {
            duration = (
                <div className="duration">
                    {utils.formatDuration(song.duration)}
                </div>
            )
        }

        return (
                <div className="library-entry-song" onClick={this.props.handleClick}>
                    <div className="header">
                        {title}
                        {version}
                    </div>
                    {songPreviewDetails}
                    {duration}
                    {tags}
                </div>
            )
    }
}
