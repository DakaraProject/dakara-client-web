import { connect } from 'react-redux'
import WorksList from '../components/WorksList'
import { loadLibraryEntries } from '../actions'

const mapStateToProps = (state, ownProps) => ({
    works: state.library.entries.results,
    workType: ownProps.params.workType
})

const WorkPageList = connect(
    mapStateToProps,
    { loadWorks: loadLibraryEntries }
)(WorksList)

export default WorkPageList
