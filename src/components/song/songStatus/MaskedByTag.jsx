import classNames from 'classnames'
import PropTypes from 'prop-types'

export default function MaskedByTag({ expanded }) {
  let message
  if (expanded) {
    message = (
      <span className="message">
        This song is masked because at least one of its tags is deactivated
      </span>
    )
  }
  return (
    <li
      className={classNames('song-status masked-by-tag warning', {
        'expanded listable': expanded,
      })}
    >
      <span className="icon">
        <i className="las la-eye-slash"></i>
      </span>
      {message}
    </li>
  )
}

MaskedByTag.propTypes = {
  expanded: PropTypes.bool,
}
