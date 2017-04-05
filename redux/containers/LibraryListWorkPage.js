import { connect } from 'react-redux'
import LibraryListWork from '../components/LibraryListWork'
import { loadLibraryEntries } from '../actions'

const mapStateToProps = (state, ownProps) => ({
    entries: state.library.entries,
    workType: ownProps.params.workType
})

const LibraryListWorkPage = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(LibraryListWork)

export default LibraryListWorkPage
