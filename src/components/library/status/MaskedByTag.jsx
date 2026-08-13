import classNames from 'classnames'
import PropTypes from 'prop-types'

export default function MaskedByTag({ expanded, className }) {
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
      className={classNames(
        'status masked-by-tag warning transition',
        className,
        {
          'expanded listable': expanded,
        }
      )}
    >
      <div className="illustration">
        <span className="icon">
          <i className="las la-eye-slash"></i>
        </span>
      </div>
      {message}
    </li>
  )
}

MaskedByTag.propTypes = {
  expanded: PropTypes.bool,
  className: PropTypes.string,
}
