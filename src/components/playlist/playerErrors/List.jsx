import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'

import { loadPlayerErrors } from 'actions/playlist'
import ListingList from 'components/generics/listing/List'
import Navigator from 'components/generics/Navigator'
import PlayerErrorsEntry from 'components/playlist/playerErrors/Entry'
import { Status } from 'reducers/alterationsResponse'
import { playerErrorsStatePropType } from 'reducers/playlist'
import { playerErrorsDigestStatePropType } from 'reducers/playlistDigest'

export default function PlayerErrorsList() {
  const playerErrorsDigestState = useSelector(
    (state) => state.playlist.digest.playerErrors
  )
  const playerErrorsState = useSelector((state) => state.playlist.playerErrors)
  const { playerErrorsHash } = playerErrorsDigestState.data
  const { status: playerErrorsStatus } = playerErrorsState

  const [searchParams, _] = useSearchParams()
  const { page, query } = Object.fromEntries(searchParams.entries())

  const dispatch = useDispatch()

  // fetch player errors from server
  const refreshEntries = useCallback(() => {
    dispatch(
      loadPlayerErrors({
        page,
      })
    )
  }, [dispatch, page])

  useEffect(() => {
    // refresh the player errors immediately and if the page or the query changes
    refreshEntries()
  }, [refreshEntries, page, query])

  useEffect(() => {
    // refresh the player errors if the player errors hash changes
    if (playerErrorsStatus !== Status.pending) {
      refreshEntries()
    }
  }, [refreshEntries, playerErrorsHash, playerErrorsStatus])

  const { playerErrors, count, pagination } = playerErrorsState.data

  const errorsList = playerErrors.map((playerError) => (
    <PlayerErrorsEntry key={playerError.id} playerError={playerError} />
  ))

  return (
    <div id="player-errors">
      <ListingList
        status={playerErrorsStatus}
        transitionObservable={playerErrorsHash}
      >
        {errorsList}
      </ListingList>
      <Navigator
        count={count}
        pagination={pagination}
        names={{
          singular: 'error',
          plural: 'errors',
        }}
      />
    </div>
  )
}

PlayerErrorsList.propTypes = {
  playerErrorsDigestState: playerErrorsDigestStatePropType.isRequired,
  playerErrorsState: playerErrorsStatePropType.isRequired,
}
