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
    getLibraryNameInfo() {
        const { workType: workTypeQueryName, workTypes } = this.props

        // Wait for worktypes to be fetched
        if (!workTypes.hasFetched) {
            return {
                singular: "work",
                plural: "works",
                placeholder: "What are you looking for?",
                serverName: "works"
            }
        }

        // Find work type matching the query name
        const workType = workTypes.data.results.find(
            (workType) => workType.query_name == workTypeQueryName
        )

        if (!workType) {
            // Fall back if work not found
            return {
                singular: "work",
                plural: "works",
                placeholder: "What are you looking for?",
                serverName: "works"
            }
        }

        return {
            singular: workType.name.toLowerCase(),
            plural: workType.name_plural.toLowerCase(),
            placeholder: `What ${workType.name.toLowerCase()} do you want?`,
            serverName: "works"
        }
    }

    getLibraryEntryList = () => {
        if (!this.props.entries || !this.props.entries.data) {
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
    entries: state.library.work[ownProps.match.params.workType],
    workTypes: state.library.workTypes,
    workType: ownProps.match.params.workType
})

WorkList = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(WorkList)

export default WorkList
