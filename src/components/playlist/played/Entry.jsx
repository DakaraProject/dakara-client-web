import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'
import { connect } from 'react-redux'

import { Details, DetailText } from 'components/generics/Details'
import {
  ListingEntry,
  ListingEntryExpanded,
} from 'components/generics/listing/Entry'
import HasError from 'components/playlist/status/HasError'
import PlaylistEntryWidget from 'components/playlist/widgets/PlaylistEntry'
import { playerErrorsDigestStatePropType } from 'reducers/playlistDigest'
import { playlistEntryPropType } from 'serverPropTypes/playlist'
import {
  withNavigate,
  withSearchParams,
} from 'thirdpartyExtensions/ReactRouterDom'
import { formatDateLong } from 'utils'

class Entry extends Component {
  static propTypes = {
    entry: playlistEntryPropType.isRequired,
    playerErrorsDigestState: playerErrorsDigestStatePropType.isRequired,
    navigate: PropTypes.func.isRequired,
    searchParams: PropTypes.object.isRequired,
    setSearchParams: PropTypes.func.isRequired,
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
    const { entry, playerErrorsDigestState, searchParams } = this.props

    const expanded = searchParams.get('expanded') == entry.id

    const extra = []
    const extraExpanded = []

    /**
     * Has an error
     */

    if (
      playerErrorsDigestState.data.playerErrors.find(
        (e) => e.playlist_entry.id === entry.id
      )
    ) {
      extra.push(<HasError />)
      extraExpanded.push(<HasError expanded />)
    }

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

    const entryExpanded = (
      <ListingEntryExpanded controls={controls} extra={extraExpanded}>
        <Details>
          <DetailText icon="la-user" name="For">
            {entry.owner.username}
          </DetailText>
          {entry.use_instrumental && (
            <DetailText icon="la-microphone-slash" name="Instrumental">
              Used the instrumental version
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

    return (
      <ListingEntry
        id={entry.id}
        controls={controls}
        extra={extra}
        entryExpanded={entryExpanded}
      >
        {expanded ? (
          <PlaylistEntryWidget
            entry={entry}
            noOwner
            noInstrumental
            truncatable
          />
        ) : (
          <PlaylistEntryWidget entry={entry} truncatable />
        )}
      </ListingEntry>
    )
  }
}

const mapStateToProps = (state) => ({
  playerErrorsDigestState: state.playlist.digest.playerErrors,
})

Entry = withSearchParams(withNavigate(connect(mapStateToProps, {})(Entry)))

export default Entry
