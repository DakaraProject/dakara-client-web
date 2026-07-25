import classNames from 'classnames'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Link } from 'react-router'

import { playerErrorPropType } from 'serverPropTypes/playlist'

export default function HasError({ playerError, expanded, className }) {
  let message
  if (expanded) {
    message = (
      <span className="message">
        This playlist entry encountered{' '}
        <Link
          to={{
            pathname: '/playlist/player-errors',
            search: queryString.stringify({
              query: `id:""${playerError.id}""`,
              expanded: playerError.id,
            }),
          }}
        >
          an error
        </Link>{' '}
      </span>
    )
  }
  return (
    <li
      className={classNames('status has-error danger transition', className, {
        'expanded listable': expanded,
      })}
    >
      <div className="illustration">
        <span className="icon">
          <i className="las la-exclamation-triangle"></i>
        </span>
      </div>
      {message}
    </li>
  )
}

HasError.propTypes = {
  expanded: PropTypes.bool,
  playerError: playerErrorPropType.isRequired,
  className: PropTypes.string,
}
