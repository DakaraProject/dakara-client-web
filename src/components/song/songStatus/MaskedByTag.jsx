import PropTypes from 'prop-types'
import classNames from 'classnames'

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
    <div
      className={classNames('song-status masked-by-tag warning', {
        'expanded listable': expanded,
        far: !expanded,
      })}
    >
      <span className="icon">
        <i className="las la-eye-slash"></i>
      </span>
      {message}
    </div>
  )
}

MaskedByTag.propTypes = {
  expanded: PropTypes.bool,
}
