import classNames from 'classnames'
import PropTypes from 'prop-types'

export default function ExceedsKaraStopTime({ expanded }) {
  let message
  if (expanded) {
    message = (
      <span className="message">
        This song would exceed the kara stop time if added to the playlist
      </span>
    )
  }
  return (
    <li
      className={classNames('song exceeds-kara-stop-time warning', {
        'expanded listable': expanded,
      })}
    >
      <span className="icon">
        <i className="las la-clock"></i>
      </span>
      {message}
    </li>
  )
}

ExceedsKaraStopTime.propTypes = {
  expanded: PropTypes.bool,
}
