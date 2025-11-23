import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'

import { loadPlaylistEntries } from 'actions/playlist'
import ListingList from 'components/generics/listing/List'
import Navigator from 'components/generics/Navigator'
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

  // fetch played playlist entries from server
  const refreshEntries = useCallback(() => {
    dispatch(
      loadPlaylistEntries('played', {
        page,
      })
    )
  }, [dispatch, page])

  useEffect(() => {
    // refresh the played playlist immediately and if the page or the query changes
    refreshEntries()
  }, [refreshEntries, page, query])

  useEffect(() => {
    // refresh the played playlist if the playlist hash changes
    if (playlistPlayedStatus !== Status.pending) {
      refreshEntries()
    }
  }, [refreshEntries, playedEntriesHash, playlistPlayedStatus])

  const { played, count, pagination } = playlistPlayedState.data

  const playedComponent = played.map((entry) => (
    <PlayedEntry key={entry.id} entry={entry} />
  ))

  return (
    <div id="played">
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
