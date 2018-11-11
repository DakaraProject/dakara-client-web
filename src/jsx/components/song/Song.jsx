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
        karaokeRemainingSeconds: PropTypes.number,
    }
    
    /**
     * Compute the best matching work title to display with associated work link 
     * among the work links depending on the query for a Song.
     * @param {array} workLinks - WorkLinks associated to the song
     * @returns {Object}
     */
    computeBestWorkMatching(workLinks) {
        let workMatched = workLinks[0]
        let workTitle = workLinks[0].work.title

        // Display the first work when the query is invalid
        if (!this.props.query) return { workMatched: workMatched, workTitle: workTitle }
        
        let queryWork = this.props.query.remaining.join(' ')
        // Display the first work when the query is empty
        if (queryWork.length == 0) return { workMatched : workMatched, workTitle: workTitle }

        // Compute the matching title and distance for each worklink
        let stringDistanceList = workLinks.map(function(wl) {
            
            // Retrieve the work title and work alternative titles from the work link
            let titleList = [wl.work.title].concat(wl.work.alternative_titles.map((t) => t.title));
            
            // Return the best matching title of this work link with the query
            return matchTitle(titleList);
        }).filter((e) => e)
        
        // Query may match the song title but not the work
        // therefore we need to check if there is at least one work matching
        if (stringDistanceList.length > 0) {
            // Compute the index of the matching work
            let distanceList = stringDistanceList.map((t) => t.distance)
            let indexMin = distanceList.indexOf(Math.min(distanceList))

            workMatched = workLinks[indexMin]
            workTitle = stringDistanceList[indexMin].title
        }

        return { workMatched: workMatched, workTitle: workTitle }

        /** 
         * Find the fittest title to match the query for a single work
         * @param {array} titles - Title and alternative titles of the work
         * @returns {Object} If at least one title has matched with the query,
         * returns an object with title and distance as fields, if not
         * returns false
         */
        function matchTitle(titles) {
            let titleDistanceList = [];
            let regex = new RegExp(queryWork, "i");

            // Compute for each title the distance between the title and the query
            // we need to check that the query is included in the title matching
            titles.forEach(function(title) {
                if (regex.test(title))
                    titleDistanceList.push({
                        title: title, 
                        distance: title.length - queryWork.length
                });
            });
            if (titleDistanceList.length > 0) {
                // Compute the title for which the distance is the minimum
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
            
            // Display the works that matches the best the query if any
            // Highlighted with query
            let displayedWorkLink
            if (song.works.length > 0) {

                    // Compute the best matching work with the query
                    let workMatching = this.computeBestWorkMatching(song.works)

                    // Display the work and the work title that match the best the query
                    displayedWorkLink = (
                        <WorkLink
                            workLink={workMatching.workMatched}
                            workTitle={workMatching.workTitle}
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
                    {displayedWorkLink}
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
