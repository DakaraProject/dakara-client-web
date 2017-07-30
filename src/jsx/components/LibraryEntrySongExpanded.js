import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import SongTagList from './SongTagList'
import SongExpandedWorkEntry from './SongExpandedWorkEntry'
import SongExpandedArtistEntry from './SongExpandedArtistEntry'

export default class LibraryEntrySongExpanded extends Component {
    /**
     * Method used by child components WorkEntry and ArtistsEnty
     * to set new search criteria
     */
    setQuery = (search) => {
        const { location } = this.props
        browserHistory.push({pathname: location.pathname, query: {search}})
    }

    render() {
        const song = this.props.song

        /**
         * Works
         */

        // Generate object containing works by type
        const worksByType = {}

        for(let workItem of song.works) {
            const workType = workItem.work.work_type.query_name
            let list = worksByType[workType]
            if(!list) {
                list = []
                worksByType[workType] = list
            }
            list.push(workItem)
        }

        // Iterate over each work type
        const worksRenderList = Object.keys(worksByType).map( key => {
            const worksList = worksByType[key]
            const workType = worksList[0].work.work_type

            // Create SongExpandedWorkEntry for each work for this work type
            const worksForTypeList = worksList.map( work => (
                        <SongExpandedWorkEntry
                            key={work.work.id}
                            work={work}
                            setQuery={this.setQuery}
                        />
            ))

            // Display the list of works, preceded by the work type
            return (
                    <div key={workType.query_name} className="works expanded-item">
                        <h4 className="header">
                            <span className="icon">
                                <i className={"fa fa-" + workType.icon_name}></i>
                            </span>
                            <span className="name">
                                {workType.name + (worksForTypeList.length > 1 ? 's' : '')}
                            </span>
                        </h4>
                        <ul className="sublisting">{worksForTypeList}</ul>
                    </div>
                )
        })

        /**
         * Artists
         */

        // Create SongExpandedArtistEntry for each artist
        const artistList = song.artists.map(artist => (
                    <SongExpandedArtistEntry
                        key={artist.id}
                        artist={artist}
                        setQuery={this.setQuery}
                    />
        ))

        // Display the list of works preceded by "Artist"
        let artists
        if (song.artists.length > 0) {
            artists = (
                    <div className="artists expanded-item">
                        <h4 className="header">
                            <span className="icon">
                                <i className="fa fa-music"></i>
                            </span>
                            <span className="name">Artist{song.artists.length > 1 ? 's' : ''}</span>
                        </h4>
                        <ul className="sublisting">{artistList}</ul>
                    </div>
                )
        }

        /**
         * Details
         */

        let detailSong
        if (song.detail) {
            detailSong = (
                    <div className="detail-song expanded-item">
                        <h4 className="header">
                            <span className="icon">
                                <i className="fa fa-file-text"></i>
                            </span>
                            <span className="name">Music details</span>
                        </h4>
                        <div className="text">{song.detail}</div>
                    </div>
                )
        }

        let detailVideo
        if (song.detail_video) {
            detailVideo = (
                    <div className="detail_video expanded-item">
                        <h4 className="header">
                            <span className="icon">
                                <i className="fa fa-file-text"></i>
                            </span>
                            <span className="name">Video details</span>
                        </h4>
                        <div className="text">{song.detail_video}</div>
                    </div>
                )
        }

        /**
         * Tags
         */

        let tags
        if (song.tags.length > 0) {
            tags = (
                    <div className="tags expanded-item">
                        <h4 className="header">
                            <span className="icon">
                                <i className="fa fa-tags"></i>
                            </span>
                            <span className="name">Tags</span>
                        </h4>
                        <SongTagList tags={song.tags} setQuery={this.setQuery}/>
                    </div>
                )
        }

        return (
                <div className="library-entry-song-expanded-subcontainer">
                    <div className="library-entry-song-expanded-details">
                        {artists}
                        {worksRenderList}
                        {detailSong}
                        {detailVideo}
                        {tags}
                    </div>
                </div>
            )
    }
}