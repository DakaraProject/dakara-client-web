import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'

import { loadPlaylistEntries } from 'actions/playlist'
import ListingList from 'components/generics/listing/List'
import Navigator from 'components/generics/Navigator'
import QueuingEntry from 'components/playlist/queuing/Entry'
import { Status } from 'reducers/alterationsResponse'

export default function QueuingList() {
  const playlistEntriesDigestState = useSelector(
    (state) => state.playlist.digest.entries
  )
  const playlistQueuingState = useSelector((state) => state.playlist.queuing)
  const { queuingEntriesHash, queuingEntries } = playlistEntriesDigestState.data
  const { status: playlistQueuingStatus } = playlistQueuingState

  const [searchParams, setSearchParams] = useSearchParams()
  const { page, query } = Object.fromEntries(searchParams.entries())

  const dispatch = useDispatch()

  useEffect(
    () => {
      // refresh the queuing playlist immediately and if the page, the query,
      // or the hash changes
      if (playlistQueuingStatus !== Status.pending) {
        dispatch(
          loadPlaylistEntries('queuing', {
            page,
          })
        )
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, query, queuingEntriesHash]
  )

  useEffect(
    () => {
      // if the page of entries could not be obtained, request the previous
      // page
      if (playlistQueuingState.status === Status.failed && page > 1) {
        searchParams.set('page', page - 1)
        setSearchParams(searchParams)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playlistQueuingStatus, page]
  )

  const { queuing, count, pagination } = playlistQueuingState.data

  const firstId = queuingEntries?.[0]?.id
  const lastId = queuingEntries.slice(-1)?.[0]?.id
  const isFirstPage = page === 1
  const isLastPage = page === pagination.last

  const queuingComponents = queuing.map((entry, position) => (
    <QueuingEntry
      key={entry.id}
      entry={entry}
      positions={{
        position,
        firstId,
        lastId,
        isFirstPage,
        isLastPage,
      }}
    />
  ))

  return (
    <div id="queuing">
      <ListingList
        fetchStatus={playlistQueuingStatus}
        transitionObservable={queuingEntriesHash}
      >
        {queuingComponents}
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
