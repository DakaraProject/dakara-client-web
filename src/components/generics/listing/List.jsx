import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { TransitionGroup } from 'react-transitioning'

import ListingFetchWrapper from 'components/generics/listing/FetchWrapper'
import Collapse from 'components/transitions/Collapse'
import { ListingNoTransitionContext } from 'contexts/listing'

export default function ListingList({
  entries,
  fetchStatus,
  free,
  mini,
  noTransition,
  transitionObservable = null,
}) {
  const className = classNames('listing', { free, mini })

  const [transition, setTransition] = useState(false)
  const [transitionObservableInitial, _] = useState(transitionObservable)
  const [searchParams, __] = useSearchParams()

  // disable transition if the page changed
  const page = searchParams.get('page')
  useEffect(() => {
    // TODO fix state modification within useEffect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransition(false)
  }, [page])

  // enable transition if a given observable changed, and is different from its
  // initial value when mounted
  useEffect(() => {
    if (transitionObservable != transitionObservableInitial) {
      // TODO fix state modification within useEffect
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTransition(true)
    }
  }, [transitionObservable, transitionObservableInitial])

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
  transitionObservable: PropTypes.any,
}
