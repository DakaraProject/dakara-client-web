import { combineReducers } from 'redux'
import PropTypes from 'prop-types'
import playlist from './playlist'
import { PLAYER_DIGEST_REQUEST, PLAYER_DIGEST_SUCCESS, PLAYER_DIGEST_FAILURE } from 'actions/player'
import { FORM_SUCCESS } from 'actions/forms'
import { ALTERATION_SUCCESS } from 'actions/alterationsStatus'
import { Status } from './alterationsStatus'
import { playlistEntryPropType, playerStatusPropType, playerManagePropType, playerErrorPropType, karaStatusPropType } from 'serverPropTypes/playlist'

/**
 * This reducer contains player related state
 */

/**
 * Player information digest from server
 */

export const playerDigestPropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: PropTypes.shape({
        player_status: playerStatusPropType.isRequired,
        player_manage: playerManagePropType.isRequired,
        player_errors: PropTypes.arrayOf(playerErrorPropType).isRequired,
        kara_status: karaStatusPropType.isRequired,
    }).isRequired,
})

const defaultPlayerDigest = {
    status: null,
    data: {
        player_status: {
            playlist_entry: null,
            timing: 0
        },
        player_manage: {
            pause: false,
            skip: false
        },
        player_errors: [],
        kara_status: {
            status: null,
        },
    },
}

function digest(state = defaultPlayerDigest, action) {
    switch (action.type) {
        case PLAYER_DIGEST_REQUEST:
            return {
                ...state,
                status: state.status || Status.pending
            }

        case PLAYER_DIGEST_SUCCESS:
            return {
                status: Status.successful,
                data: action.response,
            }

        case PLAYER_DIGEST_FAILURE:
            return {
                ...state,
                status: Status.failed,
            }

        // if a pause command has been successfuly sent to the server,
        // adapt the state now
        case ALTERATION_SUCCESS:
            if (action.alterationName === 'sendPlayerCommand' &&
                action.elementId === 'pause') {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        player_manage: {
                            ...state.data.player_manage,
                            pause: action.value,
                        }
                    }
                }
            }

            return state

        // if the kara status has been successfuly edited, adapt the state now
        case FORM_SUCCESS:
            if (action.formName == "editKaraStatus") {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        kara_status: {
                            status: action.response.status
                        }
                    }
                }
            }

        default:
            return state
    }
}

/**
 * Player
 */

const player = combineReducers({
    digest,
    playlist,
})

export default player
