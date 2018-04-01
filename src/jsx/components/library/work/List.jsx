import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import WorkEntry from './Entry'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import { workLibraryItemPropType, workTypeLibraryPropType } from 'reducers/library'

class WorkList extends Component {
    static propTypes = {
        workLibraryItem: workLibraryItemPropType,
        libraryType: PropTypes.string.isRequired,
        workTypeLibrary: workTypeLibraryPropType.isRequired,
    }

    render() {
        if (!this.props.workLibraryItem || !this.props.workLibraryItem.data) {
            return null
        }

        const { works, count, pagination, query } = this.props.workLibraryItem.data

        const libraryEntryWorkList = works.map(work =>
              <WorkEntry
                key={work.id}
                work={work}
                workType={this.props.libraryType}
                query={query}
              />
        )

        const libraryNameInfo = getWorkLibraryNameInfo(
            this.props.libraryType,
            this.props.workTypeLibrary.data.workTypes
        )

        return (
            <div className="work-list">
                <ListingFetchWrapper
                    status={this.props.workLibraryItem.status}
                >
                    <ul className="library-list listing">
                        {libraryEntryWorkList}
                    </ul>
                </ListingFetchWrapper>
                <Navigator
                    count={count}
                    pagination={pagination}
                    names={{
                        singular: `${libraryNameInfo.singular} found`,
                        plural: `${libraryNameInfo.plural} found`
                    }}
                    location={location}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    workLibraryItem: state.library.work[ownProps.libraryType],
    workTypeLibrary: state.library.workType,
})

WorkList = connect(
    mapStateToProps,
)(WorkList)

export default WorkList

/**
 * Get a dict with the following:
 * - singular: library singular name
 * - plural: library plural name
 * - placeholder: library search placeholder
 */
export const getWorkLibraryNameInfo = (workTypeQueryName, workTypes) => {
    // Find work type matching the query name
    const workType = workTypes.find(
        (workType) => workType.query_name == workTypeQueryName
    )

    if (!workType) {
        // Fall back if work not found
        return {
            singular: "work",
            plural: "works",
            placeholder: "What are you looking for?",
        }
    }

    return {
        singular: workType.name.toLowerCase(),
        plural: workType.name_plural.toLowerCase(),
        placeholder: `What ${workType.name.toLowerCase()} do you want?`,
    }
}
