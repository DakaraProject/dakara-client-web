import React, { Component } from 'react'
import Highlighter from 'react-highlight-words'
import PropTypes from 'prop-types'
import { formatDuration } from 'utils'
import WorkLink from './WorkLink'
import SongArtistList from './SongArtistList'
import SongTagList from './SongTagList'
import { songPropType } from 'serverPropTypes/library'

/**
 * Displays a song info in a compact format.
 * properties:
 * - song: song to display
 * - query: query to highlight search terms
 * - noArtistWork: don't display artist and work
 * - noDuration: don't display duration
 * - noTag: don't diplay tags
 */
export default class Song extends Component {
    static propTypes = {
        song: songPropType.isRequired,
        query: PropTypes.object, // should be isRequired
        noArtistWork: PropTypes.bool,
        noDuration: PropTypes.bool,
        noTag: PropTypes.bool,
    }

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

        // Display artist and work conditionally
        let artistWork
        if (!this.props.noArtistWork) {

            // Display first work if any
            // Highlighted with query
            let firstWorkLink
            if (song.works.length > 0) {
                // display the first work only for this display
                firstWorkLink = (
                        <WorkLink
                            workLink={song.works[0]}
                            query={this.props.query}
                            noEpisodes
                        />
                )
            }

            // Display artists
            const artists = (
                        <SongArtistList
                            artists={song.artists}
                            query={this.props.query}
                        />
                )

            artistWork = (
                <div className="artist-work">
                    {firstWorkLink}
                    {artists}
                </div>
            )
        }

        /**
         * Song duration
         * Display conditionally
         */

        let duration
        if (!this.props.noDuration) {
            duration = (
                <div className="duration">
                    {formatDuration(song.duration)}
                </div>
            )
        }

        /**
         * Song tags
         * Display conditionally
         */

        let tags
        if (!this.props.noTag) {
            tags = (
                <SongTagList
                    tags={song.tags}
                    query={this.props.query}
                    unclickable={true}
                />
            )
        }

        return (
                <div className="song" onClick={this.props.handleClick}>
                    <div className="header">
                        {title}
                        {version}
                    </div>
                    {artistWork}
                    {duration}
                    {tags}
                </div>
            )
    }
}
