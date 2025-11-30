import PropTypes from 'prop-types'

export default function Checkmark({ enabled }) {
  if (!enabled) {
    return null
  }

  return (
    <span className="icon">
      <i className="shapes checkmark"></i>
    </span>
  )
}
Checkmark.propTypes = {
  enabled: PropTypes.bool,
}
