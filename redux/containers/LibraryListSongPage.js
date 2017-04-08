import { connect } from 'react-redux'
import LibraryListSong from '../components/LibraryListSong'
import { loadLibraryEntries } from '../actions'

const mapStateToProps = (state) => ({
    entries: state.library.entries,
    playlistEntries: state.player.playlist.entries.data,
    playerStatus: state.player.status.data
})

const LibraryListSongPage = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(LibraryListSong)

export default LibraryListSongPage
