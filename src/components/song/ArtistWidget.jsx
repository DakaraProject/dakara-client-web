import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'

import HighlighterQuery from 'components/generics/HighlighterQuery'
import { artistPropType } from 'serverPropTypes/library'

export default class ArtistWidget extends Component {
  static propTypes = {
    artist: artistPropType.isRequired,
    query: PropTypes.object,
    noIcon: PropTypes.bool,
    noCount: PropTypes.bool,
    truncatable: PropTypes.bool,
  }

  render() {
    const { artist, query, noIcon, noCount, truncatable } = this.props

    /**
     * Artist icon
     */

    let icon
    if (!noIcon) {
      icon = (
        <span className="icon">
          <i className="las la-microphone-alt"></i>
        </span>
      )
    }

    /**
     * Song count
     */

    let count
    if (!noCount) {
      count = <span className="count">{artist.song_count}</span>
    }

    return (
      <div className={classNames('artist-widget', { truncatable })}>
        {icon}
        <HighlighterQuery
          className="artist"
          query={query}
          searchWords={(q) => q.artist.contains.concat(q.remaining)}
          textToHighlight={artist.name}
        />
        {count}
      </div>
    )
  }
}
