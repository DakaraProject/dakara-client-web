import { connect } from 'react-redux'
import LibraryListWork from '../components/LibraryListWork'
import { loadLibraryEntries } from '../actions'

const mapStateToProps = (state, ownProps) => ({
    works: state.library.entries.results,
    workType: ownProps.params.workType
})

const LibraryListWorkPage = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(LibraryListWork)

export default LibraryListWorkPage
