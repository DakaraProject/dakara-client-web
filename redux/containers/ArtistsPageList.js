import { connect } from 'react-redux'
import ArtistsList from '../components/ArtistsList'
import { loadLibraryEntries } from '../actions'

const mapStateToProps = (state) => ({
    artists: state.library.entries.results
})

const ArtistPageList = connect(
    mapStateToProps,
    { loadArtists: loadLibraryEntries }
)(ArtistsList)

export default ArtistPageList
