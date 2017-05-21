import { connect } from 'react-redux'
import Playlist from '../components/Playlist'
import { loadPlaylist, toogleCollapsedPlaylist, removeEntryFromPlaylist } from '../actions'

const mapStateToProps = (state) => ({
    playerStatus: state.player.status,
    playlist: state.player.playlist
})

const PlaylistPage = connect(
    mapStateToProps,
    { loadPlaylist, toogleCollapsedPlaylist, removeEntryFromPlaylist }
)(Playlist)

export default PlaylistPage
