import PropTypes from 'prop-types'
import { songPropType } from './library'
import { userPropType } from './users'

export const playlistEntryPropType = PropTypes.shape({
    id: PropTypes.any.isRequired,
    song: songPropType.isRequired,
    owner: userPropType.isRequired,
})
