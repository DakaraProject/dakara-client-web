import classNames from 'classnames'
import PropTypes from 'prop-types'

const permissionLevels = {
  u: { text: 'user', icon: 'user' },
  m: { text: 'manager', icon: 'user-cog' },
}

export default function PermissionText({ level, truncatable }) {
  if (!level) {
    return null
  }

  const { text, icon } = permissionLevels[level]

  return (
    <span className={classNames('permission-text', { truncatable })}>
      <span className="icon">
        <i className={`las la-${icon}`}></i>
      </span>
      <span className="text">{text}</span>
    </span>
  )
}

PermissionText.propTypes = {
  level: PropTypes.string,
  truncatable: PropTypes.bool,
}
