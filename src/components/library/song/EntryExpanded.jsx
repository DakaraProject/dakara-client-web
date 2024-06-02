import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { clearAlteration } from 'actions/alterations'
import { addSongToPlaylistWithOptions } from 'actions/playlist'
import { withSearchParams } from 'components/adapted/ReactRouterDom'
import HighlighterQuery from 'components/generics/HighlighterQuery'
import Notification from 'components/generics/Notification'
import SongEntryExpandedArtist from 'components/library/song/EntryExpandedArtist'
import SongEntryExpandedWork from 'components/library/song/EntryExpandedWork'
import { CanAddToPlaylist, IsPlaylistUser} from 'components/permissions/Playlist'
import SongTagList from 'components/song/SongTagList'
import { songPropType } from 'serverPropTypes/library'

class SongEntryExpanded extends Component {
    static propTypes = {
        canAdd: PropTypes.bool,
        query: PropTypes.object,
        searchParams: PropTypes.object.isRequired,
        setSearchParams: PropTypes.func.isRequired,
        song: songPropType.isRequired,
    }

    componentWillUnmount() {
        this.props.clearAlteration('addSongToPlaylistWithOptions', this.props.song.id)
    }

    /**
     * Method used by child components WorkEntry and ArtistsEnty
     * to set new search criteria
     */
    setQuery = (query) => {
        this.props.setSearchParams({query, page: 1})
    }

    render() {
        const { song, query, canAdd } = this.props

        /**
         * Works
         */

        // Generate object containing works by type
        const worksByType = {}

        for (let workItem of song.works) {
            const workType = workItem.work.work_type.query_name
            let list = worksByType[workType]
            if (!list) {
                list = []
                worksByType[workType] = list
            }
            list.push(workItem)
        }

        // Iterate over each work type
        const worksRenderList = Object.keys(worksByType).map( key => {
            const worksList = worksByType[key]
            const workType = worksList[0].work.work_type

            // Create SongEntryExpandedWork for each work for this work type
            const worksForTypeList = worksList.map( work => (
                        <SongEntryExpandedWork
                            key={work.work.id}
                            work={work}
                            setQuery={this.setQuery}
                        />
            ))

            // Display the list of works, preceded by the work type
            return (
                    <div key={workType.query_name} className="works entry">
                        <h4 className="header">
                            <span className="icon">
                                <i className={`las la-${workType.icon_name}`}></i>
                            </span>
                            <span className="name">
                                {
                                    workType.name +
                                    (worksForTypeList.length > 1 ? 's' : '')
                                }
                            </span>
                        </h4>
                        <div className="content">
                            <ul className="sublisting">{worksForTypeList}</ul>
                        </div>
                    </div>
                )
        })

        /**
         * Artists
         */

        // Create SongEntryExpandedArtist for each artist
        const artistList = song.artists.map(artist => (
                    <SongEntryExpandedArtist
                        key={artist.id}
                        artist={artist}
                        setQuery={this.setQuery}
                    />
        ))

        // Display the list of works preceded by "Artist"
        let artists
        if (song.artists.length > 0) {
            artists = (
                    <div className="artists entry">
                        <h4 className="header">
                            <span className="icon">
                                <i className="las la-microphone-alt"></i>
                            </span>
                            <span className="name">
                                Artist{song.artists.length > 1 ? 's' : ''}
                            </span>
                        </h4>
                        <div className="content">
                            <ul className="sublisting">{artistList}</ul>
                        </div>
                    </div>
                )
        }

        /**
         * Details
         */

        let detailSong
        if (song.detail) {
            detailSong = (
                    <div className="detail-song entry">
                        <h4 className="header">
                            <span className="icon">
                                <i className="las la-file-text"></i>
                            </span>
                            <span className="name">Music details</span>
                        </h4>
                        <div className="content">
                            <div className="text">
                                <HighlighterQuery
                                    query={query}
                                    searchWords={(q) => (q.remaining)}
                                    textToHighlight={song.detail}
                                />
                            </div>
                        </div>
                    </div>
                )
        }

        let detailVideo
        if (song.detail_video) {
            detailVideo = (
                    <div className="detail_video entry">
                        <h4 className="header">
                            <span className="icon">
                                <i className="las la-file-alt"></i>
                            </span>
                            <span className="name">Video details</span>
                        </h4>
                        <div className="content">
                            <div className="text">
                                <HighlighterQuery
                                    query={query}
                                    searchWords={(q) => (q.remaining)}
                                    textToHighlight={song.detail_video}
                                />
                            </div>
                        </div>
                    </div>
                )
        }

        /**
         * Lyrics
         */

        let lyrics
        if (song.lyrics_preview) {
            const text = song.lyrics_preview.text.split('\n').map((line, index) => (
                <div className="line" key={index}>{line}</div>
            ))

            lyrics = (
                <div className="lyrics entry">
                    <h4 className="header">
                        <span className="icon">
                            <i className="las la-align-left"></i>
                        </span>
                        <span className="name">Lyrics</span>
                    </h4>
                    <div className="content">
                        <div
                            className={classNames(
                                'paragraph',
                                {truncated: song.lyrics_preview.truncated}
                            )}
                        >
                            {text}
                        </div>
                    </div>
                </div>
            )
        }

        /**
         * Tags
         */

        let tags
        if (song.tags.length > 0) {
            tags = (
                    <div className="tags entry">
                        <h4 className="header">
                            <span className="icon">
                                <i className="las la-tags"></i>
                            </span>
                            <span className="name">Tags</span>
                        </h4>
                        <div className="content">
                            <SongTagList tags={song.tags} setQuery={this.setQuery}/>
                        </div>
                    </div>
                )
        }

        /**
         * Instrumental
         */

        let instrumental
        if (song.has_instrumental) {
            instrumental = (
                <CanAddToPlaylist>
                    <IsPlaylistUser>
                        <div className="instrumental">
                            <div className="notifiable">
                                <div className="controls">
                                    <span className="text">
                                        Request instrumental track
                                    </span>
                                    <button
                                        disabled={!canAdd}
                                        className="control primary submit"
                                        onClick={() => {
                                            this.props.addSongToPlaylistWithOptions(
                                                this.props.song.id,
                                                true
                                            )
                                        }}
                                    >
                                        <span className="icon">
                                            <i className="las la-plus"></i>
                                            <span className="sub-icon">
                                                <i className="las la-microphone-slash">
                                                </i>
                                            </span>
                                        </span>
                                    </button>
                                </div>
                                <Notification
                                    alterationResponse={
                                        this.props.responseOfAddSongWithOptions
                                    }
                                    pendingMessage="Adding…"
                                    successfulMessage="Successfuly added!"
                                    failedMessage={
                                        'Error attempting to add song to playlist'
                                    }
                                />
                            </div>
                        </div>
                    </IsPlaylistUser>
                </CanAddToPlaylist>
            )
        }

        // NOTE see the documentation of the LESS class
        // `library-entry-song-expanded-subcontainer` for the nested `div`s
        return (
                <div className="library-entry-song-expanded-subcontainer">
                    <div className="library-entry-song-expanded">
                        <div className="listing-details">
                            {artists}
                            {worksRenderList}
                            {detailSong}
                            {detailVideo}
                            {lyrics}
                            {tags}
                        </div>
                        {instrumental}
                    </div>
                </div>
            )
    }
}

const mapStateToProps = (state, ownProps) => ({
    // eslint-disable-next-line max-len
    responseOfAddSongWithOptions: state.alterationsResponse.multiple.addSongToPlaylistWithOptions?.[ownProps.song.id],
})
SongEntryExpanded = withSearchParams(connect(
    mapStateToProps,
    {
        addSongToPlaylistWithOptions,
        clearAlteration
    }
)(SongEntryExpanded))

export default SongEntryExpanded
