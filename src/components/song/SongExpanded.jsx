import PropTypes from 'prop-types'
import { Component } from 'react'

import {
  DetailAny,
  DetailLongText,
  Details,
  DetailText,
} from 'components/generics/Details'
import HighlighterQuery from 'components/generics/HighlighterQuery'
import SongEntryExpandedArtist from 'components/library/song/EntryExpandedArtist'
import SongEntryExpandedWork from 'components/library/song/EntryExpandedWork'
import SongTagList from 'components/song/SongTagList'
import { songPropType } from 'serverPropTypes/library'
import { withSearchParams } from 'thirdpartyExtensions/ReactRouterDom'

class SongExpanded extends Component {
  static propTypes = {
    query: PropTypes.object,
    searchParams: PropTypes.object.isRequired,
    setSearchParams: PropTypes.func.isRequired,
    song: songPropType.isRequired,
  }

  /**
   * Method used by child components WorkEntry and ArtistsEnty
   * to set new search criteria
   */
  setQuery = (query) => {
    this.props.setSearchParams({ query, page: 1 })
  }

  render() {
    const { song, query } = this.props

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
    const worksRenderList = Object.keys(worksByType).map((key) => {
      const worksList = worksByType[key]
      const workType = worksList[0].work.work_type

      // Create SongEntryExpandedWork for each work for this work type
      const worksForTypeList = worksList.map((work) => (
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
              {workType.name + (worksForTypeList.length > 1 ? 's' : '')}
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
    const artistList = song.artists.map((artist) => (
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
      const header = (
        <>
          <span className="icon">
            <i className="las la-file-alt"></i>
          </span>
          <span className="name">Music details</span>
        </>
      )
      detailSong = (
        <DetailText header={header}>
          <HighlighterQuery
            query={query}
            searchWords={(q) => q.remaining}
            textToHighlight={song.detail}
          />
        </DetailText>
      )
    }

    let detailVideo
    if (song.detail_video) {
      const header = (
        <>
          <span className="icon">
            <i className="las la-file-alt"></i>
          </span>
          <span className="name">Video details</span>
        </>
      )
      detailVideo = (
        <DetailText header={header}>
          <HighlighterQuery
            query={query}
            searchWords={(q) => q.remaining}
            textToHighlight={song.detail_video}
          />
        </DetailText>
      )
    }

    /**
     * Lyrics
     */

    let lyrics
    if (song.lyrics_preview) {
      const header = (
        <>
          <span className="icon">
            <i className="las la-align-left"></i>
          </span>
          <span className="name">Lyrics</span>
        </>
      )
      lyrics = (
        <DetailLongText header={header}>
          {song.lyrics_preview.text}
        </DetailLongText>
      )
    }

    /**
     * Tags
     */

    let tags
    if (song.tags.length > 0) {
      const header = (
        <>
          <span className="icon">
            <i className="las la-tags"></i>
          </span>
          <span className="name">Tags</span>
        </>
      )
      tags = (
        <DetailAny header={header}>
          <SongTagList tags={song.tags} setQuery={this.setQuery} />
        </DetailAny>
      )
    }

    return (
      <div className="song-expanded">
        <Details>
          {/* {artists} */}
          {/* {worksRenderList} */}
          {detailSong}
          {detailVideo}
          {lyrics}
          {tags}
        </Details>
      </div>
    )
  }
}

SongExpanded = withSearchParams(SongExpanded)

export default SongExpanded
