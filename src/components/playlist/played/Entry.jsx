import queryString from 'query-string'
import { useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router'

import { Details, DetailText } from 'components/generics/Details'
import {
  ListingEntry,
  ListingEntryExpanded,
} from 'components/generics/listing/Entry'
import HasError from 'components/playlist/status/HasError'
import PlaylistEntryWidget from 'components/playlist/widgets/PlaylistEntry'
import { playlistEntryPropType } from 'serverPropTypes/playlist'
import { formatDateLong } from 'utils'

export default function PlayedEntry({ entry, ...rest }) {
  const query = useSelector((state) => state.playlist.played.data.query)
  const playerErrorsDigestState = useSelector(
    (state) => state.playlist.digest.playerErrors
  )

  const [searchParams, _] = useSearchParams()

  const expanded = parseInt(searchParams.get('expanded')) === entry.id

  const extra = []
  const extraExpanded = []

  // has an error
  const playerError = playerErrorsDigestState.data.playerErrors.find(
    (e) => e.playlist_entry.id === entry.id
  )
  if (playerError) {
    extra.push(<HasError playerError={playerError} key="has-error" />)
    extraExpanded.push(
      <HasError playerError={playerError} key="has-error" expanded />
    )
  }

  const controls = (
    <Link
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
      {...rest}
    >
      {expanded ? (
        <PlaylistEntryWidget
          entry={entry}
          query={query}
          noOwner
          noInstrumental
          truncatable
        />
      ) : (
        <PlaylistEntryWidget entry={entry} query={query} truncatable />
      )}
    </ListingEntry>
  )
}

PlayedEntry.propTypes = {
  entry: playlistEntryPropType.isRequired,
}
