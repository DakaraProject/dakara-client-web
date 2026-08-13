import PropTypes from 'prop-types'

export function Checkmark({ enabled }) {
  if (!enabled) {
    return null
  }

  return <i className="shapes checkmark"></i>
}
Checkmark.propTypes = {
  enabled: PropTypes.bool,
}

export function TriangleDown() {
  return <i className="shapes triangle-down"></i>
}
