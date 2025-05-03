import classNames from 'classnames'
import PropTypes from 'prop-types'

export default function HasError({ expanded }) {
  let message
  if (expanded) {
    message = (
      <span className="message">This playlist entry encountered an error.</span>
    )
  }
  return (
    <li
      className={classNames('song-status has-error danger', {
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
}
