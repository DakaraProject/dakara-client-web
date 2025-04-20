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

    let works
    if (song.works.length > 0) {
      // group works per work type
      const worksByType = Object.groupBy(
        song.works,
        (workItem) => workItem.work.work_type.query_name
      )

      // create one detail per work type
      works = Object.keys(worksByType).map((workTypeKey) => {
        const worksOfType = worksByType[workTypeKey]
        const workType = worksOfType[0].work.work_type

        const worksList = worksOfType.map((work) => (
          <SongEntryExpandedWork
            key={work.work.id}
            work={work}
            setQuery={this.setQuery}
          />
        ))

        return (
          <DetailAny
            icon={`la-${workType.icon_name}`}
            name={worksList.length > 1 ? workType.name_plural : workType.name}
            key={workTypeKey}
          >
            <ul className="sublisting">{worksList}</ul>
          </DetailAny>
        )
      })
    }

    /**
     * Artists
     */

    let artists
    if (song.artists.length > 0) {
      const artistsList = song.artists.map((artist) => (
        <SongEntryExpandedArtist
          key={artist.id}
          artist={artist}
          setQuery={this.setQuery}
        />
      ))

      artists = (
        <DetailAny
          icon="la-microphone-alt"
          name={song.artists.length > 1 ? 'Artists' : 'Artist'}
        >
          <ul className="sublisting">{artistsList}</ul>
        </DetailAny>
      )
    }

    /**
     * Details
     */

    let detailSong
    if (song.detail) {
      detailSong = (
        <DetailText icon="la-file-alt" name="Music details">
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
      detailVideo = (
        <DetailText icon="la-file-alt" name="Video details">
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
      lyrics = (
        <DetailLongText icon="la-align-left" name="Lyrics">
          {song.lyrics_preview.text}
        </DetailLongText>
      )
    }

    /**
     * Tags
     */

    let tags
    if (song.tags.length > 0) {
      tags = (
        <DetailAny icon="la-tags" name="Tags">
          <SongTagList tags={song.tags} setQuery={this.setQuery} />
        </DetailAny>
      )
    }

    return (
      <div className="song-expanded">
        <Details>
          {artists}
          {works}
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
