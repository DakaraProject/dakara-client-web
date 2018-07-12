import { PLAYLIST_SUCCESS } from './playlist'
import { DEVICE_NEW_ENTRY, DEVICE_IDLE, DEVICE_ENTRY_ERROR, DEVICE_STATUS, DEVICE_ENTRY_STARTED } from 'actions/playlist'
import { KARA_STATUS, PLAYLIST_ADD, PLAYLIST } from 'actions/playlist'

export const config = {
    messageTypes: {
        device_new_entry: DEVICE_NEW_ENTRY,
        device_idle: DEVICE_IDLE,
        device_entry_started: DEVICE_ENTRY_STARTED,
        device_entry_error: DEVICE_ENTRY_ERROR,
        device_status: DEVICE_STATUS,
        kara_status: KARA_STATUS,
        playlist_new_entry: PLAYLIST_ADD,
        playlist: PLAYLIST,
    },
    reconnectInterval: 5000,
}
