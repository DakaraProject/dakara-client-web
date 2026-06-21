import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { TransitionGroup } from 'react-transitioning'

import ListingFetchWrapper from 'components/generics/listing/FetchWrapper'
import Collapse, { COLLAPSE_DURATION } from 'components/transitions/Collapse'
import { ListingNoTransitionContext } from 'contexts/listing'
import { Status } from 'reducers/alterationsResponse'

// If requested, the animation of the items entering and exiting in this
// component is touchy. Basically, I want to animate them on the same page,
// when fetched, when a user (current one or another one) interacted with the
// entries. But from the point of view of the store, it is difficult to track
// such interaction: the entries change when changing the page, by instance.
// What I can track is:
//
// - The entries (all entries, not only the ones in the page), through the hash,
// (if the entries changed, there may be a transition);
// - The page (if the page changed, there is no transition);
// - If the entries have been fetched at least once (if this is the first time
// the entries are displayed, there is no transition).
//
// So I came up with this component below, which has a quite alambicated logic.
// I am still wondering if such gearing was necessary...
export default function ListingList({
  entries,
  fetchStatus,
  free,
  mini,
  noTransition,
  hash = null,
}) {
  const className = classNames('listing', { free, mini })

  const [lastState, setLastState] = useState({
    page: null,
    hash: null,
    firstLoad: true,
    transition: false,
  })
  let { transition } = lastState
  let transitionTimeout = null

  const [searchParams, _] = useSearchParams()

  if (!noTransition) {
    const page = searchParams.get('page')

    // detect entries have been fetched once
    let { firstLoad } = lastState
    if (firstLoad) {
      if (fetchStatus !== Status.pending) {
        firstLoad = false
      }
    }

    // allow transition evaluation if the page is the same, and the entries
    // have been fetched once
    if (page === lastState.page && !lastState.firstLoad) {
      // allow transition if hash changed
      if (hash !== lastState.hash) {
        transition = true
        // schedule to disable transition later
        transitionTimeout = setTimeout(() => {
          setLastState((state) => ({ ...state, transition: false }))
        }, COLLAPSE_DURATION)
      }
    } else {
      transition = false
      // cancel the schedule to disable transition
      transitionTimeout = null
    }

    // update the state if needed
    const newState = { hash, page, firstLoad, transition }
    if (
      hash !== lastState.hash ||
      page !== lastState.page ||
      firstLoad !== lastState.firstLoad ||
      transition !== lastState.transition
    ) {
      setLastState(newState)
    }
  }

  // clear the previous schedule to disable transition if it changes
  useEffect(
    () => () => {
      if (transitionTimeout) {
        clearTimeout(transitionTimeout)
      }
    },
    [transitionTimeout]
  )

  const content = (
    <ListingNoTransitionContext.Provider value={noTransition}>
      <ul className={className}>
        {noTransition ? (
          entries
        ) : (
          <TransitionGroup enter={transition} exit={transition}>
            {entries.map((item) => (
              <Collapse key={item.key}>{item}</Collapse>
            ))}
          </TransitionGroup>
        )}
      </ul>
    </ListingNoTransitionContext.Provider>
  )

  if (fetchStatus) {
    return (
      <ListingFetchWrapper status={fetchStatus}>{content}</ListingFetchWrapper>
    )
  }

  return content
}

ListingList.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.node).isRequired,
  fetchStatus: PropTypes.symbol,
  free: PropTypes.bool,
  mini: PropTypes.bool,
  noTransition: PropTypes.bool,
  hash: PropTypes.any,
}
