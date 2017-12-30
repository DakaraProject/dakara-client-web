import React from 'react'
import { connect } from 'react-redux'
import { loadLibraryEntries } from 'actions'
import LibraryListAbstract from '../LibraryListAbstract'
import LibraryEntryWork from './LibraryEntryWork'

class LibraryListWork extends LibraryListAbstract {
    static getName() {
        return "LibraryListWork"
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
              <LibraryEntryWork
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

LibraryListWork = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(LibraryListWork)

export default LibraryListWork
