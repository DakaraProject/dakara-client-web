import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import { playerErrorPropType } from 'serverPropTypes/playlist'

export default function HasError({ playerError, expanded }) {
  let message
  if (expanded) {
    message = (
      <span className="message">
        This playlist entry encountered{' '}
        <Link
          to={{
            pathname: '/playlist/player-errors',
            search: `query=id:${playerError.id}&expanded=${playerError.id}`,
          }}
        >
          an error
        </Link>{' '}
      </span>
    )
  }
  return (
    <li
      className={classNames('status has-error danger', {
        'expanded listable': expanded,
      })}
    >
      <span className="icon">
        <i className="las la-exclamation-triangle"></i>
      </span>
      {message}
    </li>
  )
}

HasError.propTypes = {
  expanded: PropTypes.bool,
  playerError: playerErrorPropType.isRequired,
}
