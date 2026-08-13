import queryString from 'query-string'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

import {
  DetailLongText,
  Details,
  DetailText,
} from 'components/generics/Details'
import HighlighterQuery from 'components/generics/HighlighterQuery'
import {
  ListingEntry,
  ListingEntryExpanded,
} from 'components/generics/listing/Entry'
import PlaylistEntryWidget from 'components/playlist/widgets/PlaylistEntry'
import { playerErrorPropType } from 'serverPropTypes/playlist'
import { DateTime } from 'components/generics/Timing'

export default function PlayerErrorsEntry({ playerError, ...rest }) {
  const query = useSelector((state) => state.playlist.playerErrors.data.query)

  const {
    playlist_entry: entry,
    error_message: message,
    date_created: date,
  } = playerError

  const controlSearch = (
    <Link
      key="search-song"
      className="control square primary"
      to={{
        pathname: '/library/song',
        search: queryString.stringify({
          query: `title:""${entry.song.title}""`,
          expanded: entry.song.id,
        }),
      }}
    >
      <span className="icon">
        <i className="las la-search"></i>
      </span>
    </Link>
  )

  const controls = [controlSearch]

  const controlsExpanded = [
    <Link
      key="search-entry"
      className="control primary"
      to={{
        pathname: '/playlist/played',
        search: queryString.stringify({
          query: `id:""${entry.id}""`,
          expanded: entry.id,
        }),
      }}
    >
      <span className="icon">
        <i className="las la-search"></i>
      </span>
      <span className="text">Search entry</span>
    </Link>,
    controlSearch,
  ]

  const entryExpanded = (
    <ListingEntryExpanded controls={controlsExpanded}>
      <Details>
        <DetailText icon="la-clock" name="Error at">
          <DateTime iso={date} showSeconds />
        </DetailText>
        <DetailLongText icon="la-file-alt" name="Error message">
          <HighlighterQuery
            query={query}
            searchWords={(q) => q.message.contains.concat(q.remaining)}
            textToHighlight={message}
          />
        </DetailLongText>
      </Details>
    </ListingEntryExpanded>
  )

  return (
    <ListingEntry
      id={playerError.id}
      controls={controls}
      entryExpanded={entryExpanded}
      {...rest}
    >
      <PlaylistEntryWidget entry={entry} query={query} truncatable />
    </ListingEntry>
  )
}

PlayerErrorsEntry.propTypes = {
  playerError: playerErrorPropType.isRequired,
}
