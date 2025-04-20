import classNames from 'classnames'
import PropTypes from 'prop-types'

import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'

export default function ListingList({
  children,
  fetchStatus,
  free = false,
  mini = false,
}) {
  const content = (
    <ul className={classNames('listing', { free, mini })}>{children}</ul>
  )

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
}
