import { connect } from 'react-redux'
import SongsList from '../components/SongsList'

const mapStateToProps = (state) => ({
  songs: state.libraryEntries.results
})

const SongPageList = connect(
  mapStateToProps
)(SongsList)

export default SongPageList
