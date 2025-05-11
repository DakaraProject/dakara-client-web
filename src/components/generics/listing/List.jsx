import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import ListingFetchWrapper from 'components/generics/listing/FetchWrapper'

export default function ListingList({
  children,
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

  // disable transition if search params changed
  useEffect(() => {
    setTransition(false)
  }, [searchParams])

  // enable transition if a given observable changed, and is different from its
  // initial value when mounted
  useEffect(() => {
    if (transitionObservable != transitionObservableInitial) {
      setTransition(true)
    }
  }, [transitionObservable, transitionObservableInitial])

  let content
  if (noTransition) {
    content = <ul className={className}>{children}</ul>
  } else {
    content = (
      <TransitionGroup
        className={className}
        component="ul"
        enter={transition}
        exit={transition}
      >
        {children.map((item, index) => (
          <CSSTransition
            key={index}
            classNames="add-remove"
            timeout={{
              enter: 300,
              exit: 800,
            }}
          >
            {item}
          </CSSTransition>
        ))}
      </TransitionGroup>
    )
  }

  if (fetchStatus) {
    return (
      <ListingFetchWrapper status={fetchStatus}>{content}</ListingFetchWrapper>
    )
  }

  return content
}

ListingList.propTypes = {
  children: PropTypes.node,
  fetchStatus: PropTypes.symbol,
  free: PropTypes.bool,
  mini: PropTypes.bool,
  noTransition: PropTypes.bool,
  transitionObservable: PropTypes.any,
}
