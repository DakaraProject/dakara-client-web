import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'

import { Details, DetailText } from 'components/generics/Details'
import {
  ListingEntry,
  ListingEntryExpanded,
} from 'components/generics/listing/Entry'
import PlaylistEntryWidget from 'components/playlist/PlaylistEntryWidget'
import { playlistEntryPropType } from 'serverPropTypes/playlist'
import { withNavigate } from 'thirdpartyExtensions/ReactRouterDom'
import { formatDateLong } from 'utils'

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
    const { entry, ...rest } = this.props

    const controlsExpanded = (
      <button className="control primary" onClick={this.handleSearch}>
        Search song
      </button>
    )

    const entryExpanded = (
      <ListingEntryExpanded controls={controlsExpanded}>
        <Details>
          <DetailText icon="la-user" name="For">
            {entry.owner.username}
          </DetailText>
          {entry.use_instrumental && (
            <DetailText icon="la-microphone-slash" name="Instrumental">
              Yes
            </DetailText>
          )}
          <DetailText icon="la-clock" name="Requested at">
            {formatDateLong(entry.date_created)}
          </DetailText>
          <DetailText icon="la-clock" name="Played at">
            {formatDateLong(entry.date_play)}
          </DetailText>
        </Details>
      </ListingEntryExpanded>
    )

    const controls = (
      <button className="control square primary" onClick={this.handleSearch}>
        <span className="icon">
          <i className="las la-search"></i>
        </span>
      </button>
    )

    return (
      <ListingEntry
        id={entry.id}
        controls={controls}
        entryExpanded={entryExpanded}
        {...rest}
      >
        <PlaylistEntryWidget entry={entry} truncatable />
      </ListingEntry>
    )
  }
}

Entry = withNavigate(Entry)

export default Entry
