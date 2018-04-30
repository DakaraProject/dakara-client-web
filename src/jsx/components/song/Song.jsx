import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { formatDuration } from 'utils'
import HighlighterQuery from 'components/generics/HighlighterQuery'
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
        const { song, query } = this.props

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
                            query={query}
                            noEpisodes
                        />
                )
            }

            // Display artists
            const artists = (
                        <SongArtistList
                            artists={song.artists}
                            query={query}
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
                    query={query}
                    unclickable={true}
                />
            )
        }

        return (
            <div
                className={classNames(
                    "song",
                    {disabled: song.tags.some((tag) => (tag.disabled))}
                )}
                onClick={this.props.handleClick}
            >
                    <div className="general">
                        <div className="header">
                            <HighlighterQuery
                                query={query}
                                className="title"
                                searchWords={(q) => (q.title.contains.concat(q.remaining))}
                                textToHighlight={song.title}
                            />
                            {version}
                        </div>
                        {artistWork}
                    </div>
                    {duration}
                    {tags}
                </div>
            )
    }
}
