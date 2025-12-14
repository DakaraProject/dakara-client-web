import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useOutletContext, useSearchParams } from 'react-router'

import { loadPlaylistEntries } from 'actions/playlist'
import ListingList from 'components/generics/listing/List'
import Navigator from 'components/generics/Navigator'
import SearchBox from 'components/generics/SearchBox'
import PlayedEntry from 'components/playlist/played/Entry'
import { Status } from 'reducers/alterationsResponse'

export default function PlayedList() {
  const playlistEntriesDigestState = useSelector(
    (state) => state.playlist.digest.entries
  )
  const playlistPlayedState = useSelector((state) => state.playlist.played)
  const { playedEntriesHash } = playlistEntriesDigestState.data
  const { status: playlistPlayedStatus } = playlistPlayedState

  const [searchParams, _] = useSearchParams()
  const { page, query } = Object.fromEntries(searchParams.entries())

  const dispatch = useDispatch()

  const [searchBoxQuery, setSearchBoxQuery] = useOutletContext()

  useEffect(
    () => {
      // refresh the played playlist immediately and if the page, the query, or
      // the hash changes
      if (playlistPlayedStatus !== Status.pending) {
        dispatch(
          loadPlaylistEntries('played', {
            page,
            query,
          })
        )
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, query, playedEntriesHash]
  )

  const { played, count, pagination } = playlistPlayedState.data

  const playedComponent = played.map((entry) => (
    <PlayedEntry key={entry.id} entry={entry} />
  ))

  return (
    <div id="played">
      <SearchBox
        placeholder="Search a song in passed playlist"
        query={searchBoxQuery}
        setQuery={setSearchBoxQuery}
        help={{
          example: 'title',
          fields: 'title, artist, work, owner',
          withHash: true,
        }}
      />
      <ListingList
        fetchStatus={playlistPlayedStatus}
        transitionObservable={playedEntriesHash}
      >
        {playedComponent}
      </ListingList>
      <Navigator
        count={count}
        pagination={pagination}
        names={{
          singular: 'entry',
          plural: 'entries',
        }}
      />
    </div>
  )
}
