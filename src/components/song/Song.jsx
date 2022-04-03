import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import HighlighterQuery from 'components/generics/HighlighterQuery'
import SongArtistList from 'components/song/SongArtistList'
import SongTagList from 'components/song/SongTagList'
import WorkLink from 'components/song/WorkLink'
import { songPropType } from 'serverPropTypes/library'
import { formatDuration } from 'utils'

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
        karaokeRemainingSeconds: PropTypes.number,
        noArtistWork: PropTypes.bool,
        noDuration: PropTypes.bool,
        noTag: PropTypes.bool,
        query: PropTypes.object, // should be isRequired
        song: songPropType.isRequired,
    }

    render() {
        const { song, query, karaokeRemainingSeconds } = this.props

        /**
         * Song version
         */

        let version
        if (song.version) {
            version = (
                <span className="version">
                    <HighlighterQuery
                        query={query}
                        searchWords={(q) => (q.remaining)}
                        textToHighlight={song.version}
                    /> version
                </span>
            )
        }

        // Display artist and work conditionally
        let artistWork
        let withArtistAndWork = false
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

                // check if there is at least an artist too
                withArtistAndWork = song.artists.length > 0
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
            let warningIcon
            if (karaokeRemainingSeconds < song.duration) {
                warningIcon = (
                    <span className="icon">
                        <i className="fa fa-exclamation-triangle"></i>
                    </span>
                )
            }
            duration = (
                <div className="duration">
                    {warningIcon}
                    <span className="value">{formatDuration(song.duration)}</span>
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
                    'song',
                    {
                        disabled: song.tags.some((tag) => (tag.disabled)),
                        'with-artist-and-work': withArtistAndWork
                    }
                )}
                onClick={this.props.handleClick}
            >
                    <div className="general">
                        <div className="header">
                            <HighlighterQuery
                                query={query}
                                className="title"
                                searchWords={
                                    (q) => (q.title.contains.concat(q.remaining))
                                }
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
