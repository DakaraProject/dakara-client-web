import classNames from 'classnames'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router'

import { clearAlteration } from 'actions/alterations'
import { removeEntryFromPlaylist, reorderPlaylistEntry } from 'actions/playlist'
import ConfirmationBar from 'components/generics/ConfirmationBar'
import { Details, DetailText } from 'components/generics/Details'
import {
  ListingEntry,
  ListingEntryExpanded,
} from 'components/generics/listing/Entry'
import NotificationBar from 'components/generics/NotificationBar'
import PlaylistEntryWidget from 'components/playlist/widgets/PlaylistEntry'
import Collapse from 'components/transitions/Collapse'
import {
  IsPlaylistManager,
  IsPlaylistManagerOrOwner,
} from 'permissions/components/Playlist'
import { playlistEntryPropType } from 'serverPropTypes/playlist'
import { formatDateLong } from 'utils'

function ReorderButton({ handleReorder, className, id }) {
  return (
    <button
      className="control square primary"
      onClick={() => {
        handleReorder(id)
      }}
    >
      <span className="icon">
        <i className={classNames('las', className)}></i>
      </span>
    </button>
  )
}

ReorderButton.propTypes = {
  handleReorder: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  id: PropTypes.number,
}

export default function QueuingEntry({ entry, positions, ...rest }) {
  const query = useSelector((state) => state.playlist.queuing.data.query)
  const queuingEntriesDigest = useSelector(
    (state) => state.playlist.digest.entries.data.queuingEntries
  )
  const responseOfRemoveEntry = useSelector(
    (state) =>
      state.alterationsResponse.multiple.removeEntryFromPlaylist?.[entry.id]
  )
  const responseOfReorderPlaylistEntry = useSelector(
    (state) =>
      state.alterationsResponse.multiple.reorderPlaylistEntry?.[entry.id]
  )
  const user = useSelector((state) => state.authenticatedUser)

  const [searchParams, setSearchParams] = useSearchParams()

  const dispatch = useDispatch()

  const [confirmDisplayed, setConfirmDisplayed] = useState(false)

  useEffect(
    () => () => {
      // clear alterations when component unmounts
      dispatch(clearAlteration('removeEntryFromPlaylist', entry.id))
      dispatch(clearAlteration('reorderPlaylistEntry', entry.id))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const cancelReorder = useCallback(
    () => {
      if (searchParams.has('reorder')) {
        searchParams.delete('reorder')
        setSearchParams(searchParams)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  )

  const handleReorderUp = useCallback(
    (reorderId) => {
      const currentId = entry.id

      // return early if missing data
      if (isNaN(reorderId)) {
        return
      }

      // reorder up
      dispatch(
        reorderPlaylistEntry({
          playlistEntryId: reorderId,
          beforeId: currentId,
        })
      )

      // clean reorder mode
      cancelReorder()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entry]
  )

  const handleReorderDown = useCallback(
    (reorderId) => {
      const currentId = entry.id

      // return early if missing data
      if (isNaN(reorderId)) {
        return
      }

      // reorder down
      dispatch(
        reorderPlaylistEntry({
          playlistEntryId: reorderId,
          afterId: currentId,
        })
      )

      // clean reorder mode
      cancelReorder()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entry]
  )

  const handleReorderFirst = useCallback(
    () => {
      // reorder on top of playlist
      dispatch(
        reorderPlaylistEntry({
          playlistEntryId: entry.id,
          beforeId: positions.firstId,
        })
      )

      // clean reorder mode
      cancelReorder()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entry, positions]
  )

  const handleReorderLast = useCallback(
    () => {
      // reorder on bottom of playlist
      dispatch(
        reorderPlaylistEntry({
          playlistEntryId: entry.id,
          afterId: positions.lastId,
        })
      )

      // clean reorder mode
      cancelReorder()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entry, positions]
  )

  const handleReorderToggle = useCallback(
    () => {
      // if called in reorder mode, clean reorder mode
      if (searchParams.has('reorder')) {
        cancelReorder()

        return
      }

      // otherwise, enter reorder mode
      searchParams.append('reorder', positions.position)
      setSearchParams(searchParams)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, positions]
  )

  // reorder buttons
  const reorderId = parseInt(searchParams.get('expanded'))
  const reorderIndex = parseInt(searchParams.get('reorder'))

  const expanded = reorderId === entry.id
  const inReorder = !(isNaN(reorderId) || isNaN(reorderIndex))

  // hide confirmation bar on collapse
  if (!expanded && confirmDisplayed) {
    setConfirmDisplayed(false)
  }

  const controlSearch = (
    <Link
      key="search"
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

  const controlsExpanded = [
    <IsPlaylistManager user={user} key="reorder">
      <Collapse in={inReorder} horizontal>
        <div className="transition reorder">
          {!positions.isFirstPage && (
            <ReorderButton
              handleReorder={handleReorderFirst}
              className="la-arrow-up overbar"
            />
          )}
          {!positions.isLastPage && (
            <ReorderButton
              handleReorder={handleReorderLast}
              className="la-arrow-down underbar"
            />
          )}
        </div>
      </Collapse>
      <ReorderButton
        handleReorder={handleReorderToggle}
        className={inReorder ? 'la-ban' : 'la-arrows-alt-v'}
      />
    </IsPlaylistManager>,
    controlSearch,
    <IsPlaylistManagerOrOwner user={user} object={entry} key="remove">
      <button
        className="control square danger"
        onClick={() => {
          setConfirmDisplayed(true)
        }}
      >
        <span className="icon">
          <i className="las la-trash"></i>
        </span>
      </button>
    </IsPlaylistManagerOrOwner>,
  ]

  const controls = [
    <IsPlaylistManager user={user} key="reorder">
      <Collapse in={inReorder} horizontal>
        <div className="transition reorder">
          {reorderIndex > positions.position ? (
            <ReorderButton
              handleReorder={handleReorderUp}
              className={inReorder ? 'la-arrow-up' : 'la-arrows-alt-v'}
              id={reorderId}
            />
          ) : (
            <ReorderButton
              handleReorder={handleReorderDown}
              className={inReorder ? 'la-arrow-down' : 'la-arrows-alt-v'}
              id={reorderId}
            />
          )}
        </div>
      </Collapse>
    </IsPlaylistManager>,
    controlSearch,
  ]

  const notifications = [
    <ConfirmationBar
      key="remove"
      show={confirmDisplayed}
      setShow={setConfirmDisplayed}
      onConfirm={() => {
        dispatch(removeEntryFromPlaylist(entry.id))
      }}
    />,
    <NotificationBar
      key="response-of-remove-entry"
      alterationResponse={responseOfRemoveEntry}
      pendingMessage="Removing…"
      successfulMessage="Successfuly removed!"
      successfulDuration={null}
      failedMessage="Error attempting to remove song from playlist"
    />,
    <NotificationBar
      key="response-of-reorder-playlist-entry"
      alterationResponse={responseOfReorderPlaylistEntry}
      pendingMessage={false}
      successfulMessage={false}
      failedMessage="Error attempting to reorder playlist"
    />,
  ]

  const queuingEntryDigest = queuingEntriesDigest.find((e) => e.id === entry.id)

  const entryExpanded = (
    <ListingEntryExpanded
      controls={controlsExpanded}
      notifications={notifications}
    >
      <Details>
        <DetailText icon="la-user" name="For">
          {entry.owner.username}
        </DetailText>
        {entry.use_instrumental && (
          <DetailText icon="la-microphone-slash" name="Instrumental">
            Uses the instrumental version
          </DetailText>
        )}
        <DetailText icon="la-clock" name="Requested at">
          {formatDateLong(entry.date_created)}
        </DetailText>
        {queuingEntryDigest && (
          <DetailText icon="la-clock" name="Should play at">
            {formatDateLong(queuingEntryDigest.date_play)}
          </DetailText>
        )}
      </Details>
    </ListingEntryExpanded>
  )

  return (
    <ListingEntry
      id={entry.id}
      controls={controls}
      notifications={notifications}
      entryExpanded={entryExpanded}
      onToggle={(expanded) => {
        // TODO use `searchParams` instead
        if (!expanded) {
          cancelReorder()
        }
      }}
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

QueuingEntry.propTypes = {
  entry: playlistEntryPropType.isRequired,
  positions: PropTypes.shape({
    position: PropTypes.number.isRequired,
    firstId: PropTypes.number,
    lastId: PropTypes.number,
    isFirstPage: PropTypes.bool,
    isLastPage: PropTypes.bool,
  }).isRequired,
}
