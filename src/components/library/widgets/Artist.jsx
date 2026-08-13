import classNames from 'classnames'
import PropTypes from 'prop-types'

import HighlighterQuery from 'components/generics/HighlighterQuery'
import { artistPropType } from 'serverPropTypes/library'

export default function ArtistWidget({
  artist,
  query,
  noIcon,
  noCount,
  truncatable,
}) {
  // artist icon
  let icon
  if (!noIcon) {
    icon = (
      <span className="icon">
        <i className="las la-microphone-alt"></i>
      </span>
    )
  }

  // song count
  let count
  if (!noCount) {
    count = (
      <span className="count">
        <span className="icon">
          <i className="las la-music"></i>
        </span>
        <span className="value">{artist.song_count}</span>
      </span>
    )
  }

  return (
    <div className={classNames('artist-widget', { truncatable })}>
      {icon}
      <HighlighterQuery
        className="name"
        query={query}
        searchWords={(q) => {
          let words = q.remaining

          // add artist query values if available
          if (q.artist) {
            words = words.concat(q.artist.contains)
          }

          return words
        }}
        textToHighlight={artist.name}
      />
      {count}
    </div>
  )
}

ArtistWidget.propTypes = {
  artist: artistPropType.isRequired,
  query: PropTypes.object,
  noIcon: PropTypes.bool,
  noCount: PropTypes.bool,
  truncatable: PropTypes.bool,
}
