import { connect } from 'react-redux'
import SongsList from '../components/SongsList'
import { loadSongs } from '../actions'

const mapStateToProps = (state) => ({
    songs: state.libraryEntries.results
})

const SongPageList = connect(
    mapStateToProps,
    {loadSongs}
)(SongsList)

export default SongPageList
