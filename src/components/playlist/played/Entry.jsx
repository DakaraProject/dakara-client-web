import queryString from 'query-string'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router'

import { Details, DetailText } from 'components/generics/Details'
import {
  ListingEntry,
  ListingEntryExpanded,
} from 'components/generics/listing/Entry'
import HasError from 'components/playlist/status/HasError'
import PlaylistEntryWidget from 'components/playlist/widgets/PlaylistEntry'
import { playlistEntryPropType } from 'serverPropTypes/playlist'
import { formatDateLong } from 'utils'

export default function PlayedEntry({ entry }) {
  const playerErrorsDigestState = useSelector(
    (state) => state.playlist.digest.playerErrors
  )

  const navigate = useNavigate()
  const [searchParams, _] = useSearchParams()

  const expanded = parseInt(searchParams.get('expanded')) === entry.id

  const extra = []
  const extraExpanded = []

  // has an error
  if (
    playerErrorsDigestState.data.playerErrors.find(
      (e) => e.playlist_entry.id === entry.id
    )
  ) {
    extra.push(<HasError key="has-error" />)
    extraExpanded.push(<HasError key="has-error" expanded />)
  }

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
        <PlaylistEntryWidget entry={entry} noOwner noInstrumental truncatable />
      ) : (
        <PlaylistEntryWidget entry={entry} truncatable />
      )}
    </ListingEntry>
  )
}

PlayedEntry.propTypes = {
  entry: playlistEntryPropType.isRequired,
}
