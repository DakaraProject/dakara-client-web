import { connect } from 'react-redux'
import LibraryListArtist from '../components/LibraryListArtist'
import { loadLibraryEntries } from '../actions'

const mapStateToProps = (state) => ({
    artists: state.library.entries.results
})

const LibraryListArtistPage = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(LibraryListArtist)

export default LibraryListArtistPage
