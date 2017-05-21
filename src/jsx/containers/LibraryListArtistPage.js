import { connect } from 'react-redux'
import LibraryListArtist from '../components/LibraryListArtist'
import { loadLibraryEntries } from '../actions'

const mapStateToProps = (state) => ({
    entries: state.library.artist
})

const LibraryListArtistPage = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(LibraryListArtist)

export default LibraryListArtistPage
