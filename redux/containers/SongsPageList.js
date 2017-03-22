import { connect } from 'react-redux'
import SongsList from '../components/SongsList'
import { loadLibraryEntries } from '../actions'

const mapStateToProps = (state) => ({
    songs: state.library.entries.results
})

const SongsPageList = connect(
    mapStateToProps,
    { loadSongs: loadLibraryEntries }
)(SongsList)

export default SongsPageList
