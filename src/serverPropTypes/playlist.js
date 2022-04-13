import PropTypes from 'prop-types'

import { songPropType } from 'serverPropTypes/library'
import { userPropType } from 'serverPropTypes/users'

export const playlistEntryPropType = PropTypes.shape({
    id: PropTypes.any.isRequired,
    song: songPropType.isRequired,
    use_instrumental: PropTypes.bool,
    owner: userPropType.isRequired,
    date_play: PropTypes.string,
})

export const playerStatusPropType = PropTypes.shape({
    playlist_entry: playlistEntryPropType,
    timing: PropTypes.number.isRequired,
    paused: PropTypes.bool.isRequired,
    in_transition: PropTypes.bool.isRequired,
    date: PropTypes.string.isRequired,
})

export const playerErrorPropType = PropTypes.shape({
    playlist_entry: playlistEntryPropType.isRequired,
    error_message: PropTypes.string.isRequired,
    date_created: PropTypes.string.isRequired,
})

export const karaokePropType = PropTypes.shape({
    id: PropTypes.any,
    ongoing: PropTypes.bool,
    can_add_to_playlist: PropTypes.bool,
    player_play_next_song: PropTypes.bool,
    date_stop: PropTypes.string
})

export const playerTokenPropType = PropTypes.shape({
    karaoke_id: PropTypes.any,
    key: PropTypes.string,
})
