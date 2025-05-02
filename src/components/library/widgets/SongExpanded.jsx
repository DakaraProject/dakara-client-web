import PropTypes from 'prop-types'
import { Component } from 'react'

import {
  DetailAny,
  DetailLongText,
  Details,
  DetailText,
} from 'components/generics/Details'
import HighlighterQuery from 'components/generics/HighlighterQuery'
import { ListingEntry } from 'components/generics/listing/Entry'
import ListingList from 'components/generics/listing/List'
import SongTagList from 'components/library/SongTagList'
import ArtistWidget from 'components/library/widgets/Artist'
import WorkLinkWidget from 'components/library/widgets/WorkLink'
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

        const worksList = worksOfType.map((work) => {
          const controls = (
            <button
              className="control square primary"
              onClick={() =>
                this.setQuery(`${work.work_type.query_name}:""${work.title}""`)
              }
            >
              <span className="icon">
                <i className="las la-search"></i>
              </span>
            </button>
          )
          return (
            <ListingEntry controls={controls} noHoverizable key={work.work.id}>
              <WorkLinkWidget
                workLink={work}
                query={query}
                longLinkType
                noIcon
              />
            </ListingEntry>
          )
        })

        return (
          <DetailAny
            icon={`la-${workType.icon_name}`}
            name={worksList.length > 1 ? workType.name_plural : workType.name}
            key={workTypeKey}
          >
            <ListingList mini free>
              {worksList}
            </ListingList>
          </DetailAny>
        )
      })
    }

    /**
     * Artists
     */

    let artists
    if (song.artists.length > 0) {
      const artistsList = song.artists.map((artist) => {
        const controls = (
          <button
            className="control square primary"
            onClick={() => this.setQuery(`artist:""${artist.name}""`)}
          >
            <span className="icon">
              <i className="las la-search"></i>
            </span>
          </button>
        )
        return (
          <ListingEntry controls={controls} noHoverizable key={artist.id}>
            <ArtistWidget artist={artist} query={query} noIcon noCount />
          </ListingEntry>
        )
      })

      artists = (
        <DetailAny
          icon="la-microphone-alt"
          name={song.artists.length > 1 ? 'Artists' : 'Artist'}
        >
          <ListingList mini free>
            {artistsList}
          </ListingList>
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
     * Instrumental
     */

    let instrumental
    if (song.has_instrumental) {
      instrumental = (
        <DetailText icon="la-microphone-slash" name="Instrumental">
          Has an instrumental version
        </DetailText>
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

    if (
      artists ||
      works ||
      detailSong ||
      detailVideo ||
      lyrics ||
      instrumental ||
      tags
    ) {
      return (
        <div className="song-expanded">
          <Details>
            {artists}
            {works}
            {detailSong}
            {detailVideo}
            {lyrics}
            {instrumental}
            {tags}
          </Details>
        </div>
      )
    }

    // return nothing if empty
    return null
  }
}

SongExpanded = withSearchParams(SongExpanded)

export default SongExpanded
