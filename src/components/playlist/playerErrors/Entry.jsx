import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
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

dayjs.extend(localizedFormat)

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
      className="control square primary"
      to={{
        pathname: '/playlist/played',
        search: queryString.stringify({
          query: `id:""${entry.id}""`,
          expanded: entry.id,
        }),
      }}
    >
      <span className="icon with-sub-icon">
        <i style={{}} className="las la-search"></i>
        <span className="sub-icon bottom-right">
          <i className="las la-list-ol"></i>
        </span>
      </span>
    </Link>,
    controlSearch,
  ]

  const entryExpanded = (
    <ListingEntryExpanded controls={controlsExpanded}>
      <Details>
        <DetailText icon="la-clock" name="Error at">
          {dayjs(date).format('L LTS')}
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
