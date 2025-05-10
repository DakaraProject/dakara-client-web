import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'

import {
  DetailLongText,
  Details,
  DetailText,
} from 'components/generics/Details'
import {
  ListingEntry,
  ListingEntryExpanded,
} from 'components/generics/listing/Entry'
import PlaylistEntryWidget from 'components/playlist/widgets/PlaylistEntry'
import { playerErrorPropType } from 'serverPropTypes/playlist'
import { withNavigate } from 'thirdpartyExtensions/ReactRouterDom'

dayjs.extend(localizedFormat)

class PlayerErrorsEntry extends Component {
  static propTypes = {
    playerError: playerErrorPropType.isRequired,
    navigate: PropTypes.func.isRequired,
  }

  /**
   * Search song associated to error playlist
   */
  handleSearch = () => {
    const { song } = this.props.playerError.playlist_entry
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
    const { playerError } = this.props
    const {
      playlist_entry: entry,
      error_message: message,
      date_created: date,
    } = playerError

    const controlsExpanded = (
      <button
        className="control square primary"
        onClick={() => {
          this.handleSearch()
        }}
      >
        <span className="icon">
          <i className="las la-search"></i>
        </span>
      </button>
    )

    const entryExpanded = (
      <ListingEntryExpanded controls={controlsExpanded}>
        <Details>
          <DetailText icon="la-clock" name="Error at">
            {dayjs(date).format('L LTS')}
          </DetailText>
          <DetailLongText icon="la-file-alt" name="Error message">
            {message}
          </DetailLongText>
        </Details>
      </ListingEntryExpanded>
    )

    const controls = (
      <button
        className="control square primary"
        onClick={() => {
          this.handleSearch()
        }}
      >
        <span className="icon">
          <i className="las la-search"></i>
        </span>
      </button>
    )

    return (
      <ListingEntry
        id={playerError.id}
        controls={controls}
        entryExpanded={entryExpanded}
      >
        <PlaylistEntryWidget entry={entry} truncatable />
      </ListingEntry>
    )
  }
}

PlayerErrorsEntry = withNavigate(PlayerErrorsEntry)

export default PlayerErrorsEntry
