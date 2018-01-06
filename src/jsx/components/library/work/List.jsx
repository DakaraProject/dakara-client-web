import React from 'react'
import { connect } from 'react-redux'
import { loadLibraryEntries } from 'actions'
import ListAbstract from '../ListAbstract'
import WorkEntry from './Entry'

class WorkList extends ListAbstract {

    /**
     * Get a dict with the following:
     * - singular: library singular name
     * - plural: library plural name
     * - placeholder: library search placeholder
     */
    static getLibraryNameInfo(workTypeQueryName, workTypes) {
        // Find work type matching the query name
        const workType = workTypes.find(
            (workType) => workType.query_name == workTypeQueryName
        )

        if (!workType) {
            // Fall back if work not found
            return {
                singular: "work",
                plural: "works",
                placeholder: "What are you looking for?"
            }
        }

        return {
            singular: workType.name.toLowerCase(),
            plural: workType.name_plural.toLowerCase(),
            placeholder: `What ${workType.name.toLowerCase()} do you want?`
        }
    }

    static getLibraryEntries(library, workTypeQueryName) {
        return library.work[workTypeQueryName]
    }

    getLibraryType() {
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
