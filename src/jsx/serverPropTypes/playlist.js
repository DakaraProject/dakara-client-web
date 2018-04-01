import PropTypes from 'prop-types'
import { songPropType } from './library'
import { userPropType } from './users'

export const playlistEntryPropType = PropTypes.shape({
    id: PropTypes.any.isRequired,
    song: songPropType.isRequired,
    owner: userPropType.isRequired,
})

export const playerStatusPropType = PropTypes.shape({
    playlist_entry: playlistEntryPropType,
    timing: PropTypes.number.isRequired,
})

export const playerManagePropType = PropTypes.shape({
    pause: PropTypes.bool.isRequired,
    skip: PropTypes.bool.isRequired,
})

export const playerErrorPropType = PropTypes.shape({
    id: PropTypes.any.isRequired,
    error_message: PropTypes.string.isRequired,
})

export const karaStatusPropType = PropTypes.shape({
    status: PropTypes.string.isRequired,
})
