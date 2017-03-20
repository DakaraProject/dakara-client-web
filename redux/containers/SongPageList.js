import { connect } from 'react-redux'
import SongsList from '../components/SongsList'
import { loadLibraryEntries } from '../actions'

const mapStateToProps = (state) => ({
    songs: state.libraryEntries.results
})

const SongPageList = connect(
    mapStateToProps,
    { loadSongs: loadLibraryEntries }
)(SongsList)

export default SongPageList
