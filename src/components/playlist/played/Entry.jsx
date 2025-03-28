import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'

import PlaylistPositionInfo from 'components/song/PlaylistPositionInfo'
import Song from 'components/song/Song'
import { playlistEntryPropType } from 'serverPropTypes/playlist'
import { withNavigate } from 'thirdpartyExtensions/ReactRouterDom'

class Entry extends Component {
  static propTypes = {
    entry: playlistEntryPropType.isRequired,
    navigate: PropTypes.func.isRequired,
  }

  handleSearch = () => {
    const song = this.props.entry.song
    const query = `title:""${song.title}""`
    this.props.navigate({
      pathname: '/library/song',
      search: queryString.stringify({
        query,
        expanded: song.id,
      }),
    })
  }

  render() {
    const { entry } = this.props

    return (
      <li
        className={
          'listing-entry playlist-entry library-entry library-entry-song ' +
          'hoverizable'
        }
      >
        <div className="library-entry-song-compact">
          <button
            className="expander transparent"
            onClick={() => this.handleSearch()}
          >
            <Song song={entry.song} />
          </button>
          <div className="extra">
            <PlaylistPositionInfo entryPlayed={entry} />
          </div>
        </div>
      </li>
    )
  }
}

Entry = withNavigate(Entry)

export default Entry
