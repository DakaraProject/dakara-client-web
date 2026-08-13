import PropTypes from 'prop-types'

export const userPropType = PropTypes.shape({
  id: PropTypes.any.isRequired,
  username: PropTypes.string.isRequired,
  is_superuser: PropTypes.bool,
  users_permission_level: PropTypes.string,
  library_permission_level: PropTypes.string,
  playlist_permission_level: PropTypes.string,
})
