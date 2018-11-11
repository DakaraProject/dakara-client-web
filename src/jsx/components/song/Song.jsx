import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { formatDuration } from 'utils'
import HighlighterQuery from 'components/generics/HighlighterQuery'
import WorkLink from './WorkLink'
import SongArtistList from './SongArtistList'
import SongTagList from './SongTagList'
import { songPropType } from 'serverPropTypes/library'
import levenshtein from 'fast-levenshtein'

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
        karaokeRemainingSeconds: PropTypes.number,
    }

    computeBestWorkMatching(workLinks, queryWork) {
        /**
        * Compute the best matching work and work title for a Song entry.
        * @param {array} workLinks - WorkLinks containing the work titles
        * @param {string} queryWork - Query which the work titles are matched with
        * @returns {Object} 
        */
        let workMatched = workLinks[0]
        let workTitle = workLinks[0].work.title
        if (queryWork.trim().length == 0) {
            // query string is invalid for matching
            return { workMatched: workMatched, workTitle: workTitle }
        }

        // compute the matching title and levenshtein distance for each worklink
        let stringDistanceList = workLinks.map((wl) => 
            matchTitle([wl.work.title].concat(wl.work.alternative_titles.map((t) => t.title)))).filter((e) => e)
        if (stringDistanceList.length > 0) {
            // query may match the song title but not the work
            // then we need to check there is at least one work matching

            // compute the index of the maching work
            let distanceList = stringDistanceList.map((t) => t.distance)
            let indexMin = distanceList.indexOf(Math.min(distanceList))

            workMatched = workLinks[indexMin]
            workTitle = stringDistanceList[indexMin].title
        }

        return { workMatched: workMatched, workTitle: workTitle }

        function matchTitle(titles) {
            /** 
            * Find the fittest title to match the query for a single work
            * @param {array} titles - Title and alternative titles of the work
            * @returns {Object} If at least one title has matched with the query,
            * returns an object with workMatched and workTitle as field, if not
            * returns false
            */
            let titleDistanceList = [];
            let regex = new RegExp(queryWork, "i");

            // compute the levenshtein distance between each title and the query
            // we need to check that the query is included in the title
            titles.forEach(function(title) {
                if (regex.test(title))
                    titleDistanceList.push({
                        title: title, 
                        distance: levenshtein.get(title, queryWork)
                });
            });
            if (titleDistanceList.length > 0) {
                // compute the title that minimises the levenshtein distance
                return titleDistanceList.sort((a,b) => (a.distance - b.distance))[0];
            }

            return false;
        }
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

            // Display the works that matches the best if any
            // Highlighted with query
            let firstWorkLink
            if (song.works.length > 0) {
                if (!query) {
                    // display the first work in the list
                    firstWorkLink = (
                        <WorkLink
                            workLink={song.works[0]}
                            query={query}
                            noEpisodes
                        />
                    )
                } else {
                    // display the work and the work title that match the best the query
                    let queryWork = query.remaining.join(' ')
                    // compute best matching with the levenshtein distance for each title in the list
                    let workMatching = this.computeBestWorkMatching(song.works, queryWork)

                    firstWorkLink = (
                        <WorkLink
                            workLink={workMatching.workMatched}
                            workTitle={workMatching.workTitle}
                            query={query}
                            noEpisodes
                        />
                    )
                }

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
                    "song",
                    {
                        disabled: song.tags.some((tag) => (tag.disabled)),
                        "with-artist-and-work": withArtistAndWork
                    }
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
