import { connect } from 'react-redux'
import LibraryEntrySong from '../components/LibraryEntrySong'
import { addSongToPlaylist } from '../actions'

const mapStateToProps = (state, ownProps) => ({
    query: state.library.entries.query,
    notification: state.library.songListNotifications[ownProps.song.id]
})

const LibraryEntrySongPage = connect(
    mapStateToProps,
    { addSongToPlaylist }
)(LibraryEntrySong)

export default LibraryEntrySongPage
