import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'

import HighlighterQuery from 'components/generics/HighlighterQuery'
import ArtistWidget from 'components/song/ArtistWidget'
import SongTagList from 'components/song/SongTagList'
import WorkLinkWidget from 'components/song/WorkLinkWidget'
import { songPropType } from 'serverPropTypes/library'
import { formatDuration } from 'utils'

export default class SongWidget extends Component {
  static propTypes = {
    noRelations: PropTypes.bool,
    noDuration: PropTypes.bool,
    noTags: PropTypes.bool,
    query: PropTypes.object,
    song: songPropType.isRequired,
    truncatable: PropTypes.bool,
  }

  render() {
    const { song, query, noRelations, noDuration, noTags, truncatable } =
      this.props

    /**
     * Song version
     */

    let version
    if (song.version) {
      version = (
        <HighlighterQuery
          query={query}
          className="version"
          searchWords={(q) => q.remaining}
          textToHighlight={song.version}
        />
      )
    }

    /**
     * Relations
     * (artists and works)
     */

    let relations
    if (!noRelations) {
      const works = song.works.map((work) => (
        <WorkLinkWidget
          key={work.id}
          workLink={work}
          query={query}
          noEpisodes
          truncatable={truncatable}
        />
      ))

      const artists = song.artists.map((artist) => (
        <ArtistWidget
          artist={artist}
          query={query}
          key={artist.id}
          noCount
          truncatable={truncatable}
        />
      ))

      if (artists.length > 0 || works.length > 0) {
        relations = (
          <span className="relations">
            <span className="artists">{artists}</span>
            <span className="works">{works}</span>
          </span>
        )
      }
    }

    /**
     * Song duration
     */

    let duration
    if (!noDuration) {
      duration = (
        <span className="duration">{formatDuration(song.duration)}</span>
      )
    }

    /**
     * Song tags
     */

    let tags
    if (!noTags && song.tags.length > 0) {
      tags = <SongTagList tags={song.tags} query={query} unclickable={true} />
    }

    return (
      <div className={classNames('song-widget', { truncatable })}>
        <HighlighterQuery
          query={query}
          className="title"
          searchWords={(q) => q.title.contains.concat(q.remaining)}
          textToHighlight={song.title}
        />
        {version}
        {relations}
        {duration}
        {tags}
      </div>
    )
  }
}
