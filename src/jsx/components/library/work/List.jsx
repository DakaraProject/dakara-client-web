import React from 'react'
import { connect } from 'react-redux'
import { loadLibraryEntries } from 'actions'
import ListAbstract from '../ListAbstract'
import WorkEntry from './Entry'

class WorkList extends ListAbstract {
    static getName() {
        return "WorkList"
    }

    getLibraryName() {
        return "works"
    }

    getLibraryEntryList = () => {
        if (!this.props.entries) {
            return null
        }

        const works = this.props.entries.data.results
        const libraryEntryWorkList = works.map(work =>
              <WorkEntry
                key={work.id}
                work={work}
                workType={this.props.workType}
              />
        )

        return libraryEntryWorkList
    }
}

const mapStateToProps = (state, ownProps) => ({
    entries: state.library.work[ownProps.params.workType],
    workTypes: state.library.workTypes,
    workType: ownProps.params.workType
})

WorkList = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(WorkList)

export default WorkList
