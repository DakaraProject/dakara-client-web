import { connect } from 'react-redux'
import LibraryListSong from '../components/LibraryListSong'
import { loadLibraryEntries } from '../actions'

const mapStateToProps = (state) => ({
    songs: state.library.entries.results
})

const LibraryListSongPage = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(LibraryListSong)

export default LibraryListSongPage
