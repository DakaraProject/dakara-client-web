import { connect } from 'react-redux'
import LibraryListSong from '../components/LibraryListSong'
import { loadLibraryEntries } from '../actions'

const mapStateToProps = (state) => ({
    entries: state.library.entries
})

const LibraryListSongPage = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(LibraryListSong)

export default LibraryListSongPage
