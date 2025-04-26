import classNames from 'classnames'
import PropTypes from 'prop-types'
import { TransitionGroup } from 'react-transition-group'

import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'

export default function ListingList({
  children,
  fetchStatus,
  free,
  mini,
  noTransition,
}) {
  const className = classNames('listing', { free, mini })
  let content
  if (noTransition) {
    content = <ul className={className}>{children}</ul>
  } else {
    content = (
      <TransitionGroup className={className} component="ul">
        {children}
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
  children: PropTypes.element,
  fetchStatus: PropTypes.object,
  free: PropTypes.bool,
  mini: PropTypes.bool,
  noTransition: PropTypes.bool,
}
