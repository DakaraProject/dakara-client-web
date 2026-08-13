import classNames from 'classnames'
import PropTypes from 'prop-types'

export default function ExceedsKaraStopTime({ expanded, className }) {
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
      className={classNames(
        'status exceeds-kara-stop-time warning transition',
        className,
        {
          'expanded listable': expanded,
        }
      )}
    >
      <div className="illustration">
        <span className="icon">
          <i className="las la-clock"></i>
        </span>
      </div>
      {message}
    </li>
  )
}

ExceedsKaraStopTime.propTypes = {
  expanded: PropTypes.bool,
  className: PropTypes.string,
}
