import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { withParams, withSearchParams } from 'thirdpartyExtensions/ReactRouterDom'

import { loadLibraryEntries } from 'actions/library'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import SearchBox from 'components/library/SearchBox'
import WorkEntry from 'components/library/work/Entry'
import NotFound from 'components/navigation/NotFound'
import { Status } from 'reducers/alterationsResponse'
import { workStatePropType, workTypeStatePropType } from 'reducers/library'

class WorkList extends Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        searchParams: PropTypes.object.isRequired,
        setSearchParams: PropTypes.func.isRequired,
        workState: workStatePropType,
        workTypeState: workTypeStatePropType.isRequired,
        loadLibraryEntries: PropTypes.func.isRequired,
    }

    /**
     * Fetch songs from server
     */
    refreshEntries = () => {
        this.props.loadLibraryEntries('works', {
            page: this.props.searchParams.get('page'),
            query: this.props.searchParams.get('query'),
            type: this.props.params.workType,
        })
    }

    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.searchParams !== prevProps.searchParams ||
            this.props.params !== prevProps.params
        ) {
            this.refreshEntries()
        }
    }

    render() {
        /**
         * Do not render anything if work types are not fetched
         */

        if (this.props.workTypeState.status !== Status.successful) {
            return null
        }

        const { workType: workTypeQueryName } = this.props.params
        const workType = this.props.workTypeState.data.workTypes.find(
            (workType) => workType.query_name === workTypeQueryName
        )
        const { works, count, pagination, query } = this.props.workState.data

        /**
         * Check the work type is valid
         */

        if (!workType) {
            return (
                <NotFound embedded/>
            )
        }

        /**
         * Create the WorkEntry
         */

        const libraryEntryWorkList = works.map(work =>
              <WorkEntry
                key={work.id}
                work={work}
                workType={workTypeQueryName}
                query={query}
              />
        )

        return (
            <div id="work-library">
                <SearchBox
                    placeholder={`What ${workType.name.toLowerCase()} do you want?`}
                />
                <div className="work-list">
                    <ListingFetchWrapper
                        status={this.props.workState.status}
                    >
                        <ul className="library-list listing">
                            {libraryEntryWorkList}
                        </ul>
                    </ListingFetchWrapper>
                    <Navigator
                        count={count}
                        pagination={pagination}
                        names={{
                            singular: `${workType.name.toLowerCase()} found`,
                            plural: `${workType.name_plural.toLowerCase()} found`
                        }}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    workState: state.library.works[ownProps.params.workType],
    workTypeState: state.library.workType,
})

WorkList = withSearchParams(withParams(connect(
    mapStateToProps,
    {
        loadLibraryEntries,
    }
)(WorkList)))

export default WorkList
