import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'

import HighlighterQuery from 'components/generics/HighlighterQuery'
import ArtistWidget from 'components/song/ArtistWidget'
import SongTagList from 'components/song/SongTagList'
import WorkLinkWidget from 'components/song/WorkLinkWidget'
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
        handleClick: PropTypes.func,
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
                        <WorkLinkWidget
                            workLink={song.works[0]}
                            query={query}
                            noEpisodes
                            truncatable
                        />
                )

                // check if there is at least an artist too
                withArtistAndWork = song.artists.length > 0
            }

            // Display artists
            const artists = song.artists.map(a => (
                <ArtistWidget artist={a} query={query} key={a.id} truncatable />
            ))

            artistWork = (
                <div className="artist-work">
                    {firstWorkLink}
                    <div className="artists">
                        {artists}
                    </div>
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
            if (karaokeRemainingSeconds && karaokeRemainingSeconds < song.duration) {
                warningIcon = (
                    <span className="icon">
                        <i className="las la-exclamation-triangle"></i>
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

        /**
         * Masked marker
         * Display if one of the tags is disabled
         */

        let masked
        if (song.tags.some((tag) => (tag.disabled))) {
            masked = (
                <div className="masked">
                    <span className="icon">
                        <i className="las la-eye-slash"></i>
                    </span>
                </div>
            )
        }

        return (
            <div
                className={classNames(
                    'song',
                    {
                        'with-artist-and-work': withArtistAndWork
                    }
                )}
                onClick={this.props.handleClick}
            >
                    {masked}
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
