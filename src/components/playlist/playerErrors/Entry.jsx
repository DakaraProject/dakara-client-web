import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import queryString from 'query-string'
import { useNavigate } from 'react-router'

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

dayjs.extend(localizedFormat)

export default function PlayerErrorsEntry({ playerError }) {
  const navigate = useNavigate()

  const {
    playlist_entry: entry,
    error_message: message,
    date_created: date,
  } = playerError

  const controls = (
    <button
      className="control square primary"
      onClick={() => {
        navigate({
          pathname: '/library/song',
          search: queryString.stringify({
            query: `title:""${entry.song.title}""`,
            expanded: entry.song.id,
          }),
        })
      }}
    >
      <span className="icon">
        <i className="las la-search"></i>
      </span>
    </button>
  )

  const entryExpanded = (
    <ListingEntryExpanded controls={controls}>
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

PlayerErrorsEntry.propTypes = {
  playerError: playerErrorPropType.isRequired,
}
