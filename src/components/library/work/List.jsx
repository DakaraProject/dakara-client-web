import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { loadLibraryEntries } from 'actions/library'
import ListingList from 'components/generics/listing/List'
import Navigator from 'components/generics/Navigator'
import SearchBox from 'components/library/SearchBox'
import WorkEntry from 'components/library/work/Entry'
import NotFound from 'components/navigation/NotFound'
import { Status } from 'reducers/alterationsResponse'
import { workStatePropType, workTypeStatePropType } from 'reducers/library'
import {
  withParams,
  withSearchParams,
} from 'thirdpartyExtensions/ReactRouterDom'

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
   * Check if work types are fetched
   */
  isReady = () => this.props.workTypeState.status === Status.successful

  /**
   * Fetch songs from server
   */
  refreshEntries = () => {
    if (!this.isReady()) {
      return
    }
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
      this.props.workTypeState !== prevProps.workTypeState ||
      this.props.searchParams !== prevProps.searchParams ||
      this.props.params !== prevProps.params
    ) {
      this.refreshEntries()
    }
  }

  render() {
    // do not render anything if not ready
    if (!this.isReady()) {
      return null
    }

    // get work type
    const { workType: workTypeQueryName } = this.props.params
    const workType = this.props.workTypeState.data.workTypes.find(
      (workType) => workType.query_name === workTypeQueryName
    )

    // check work type is valid
    if (!workType) {
      return <NotFound embedded />
    }

    const { works, query, count, pagination } = this.props.workState.data

    /**
     * Create the WorkEntry
     */

    const libraryEntryWorkList = works.map((work) => (
      <WorkEntry
        key={work.id}
        work={work}
        workType={workTypeQueryName}
        query={query}
      />
    ))

    return (
      <div id="work-library">
        <SearchBox
          placeholder={`What ${workType.name.toLowerCase()} do you want?`}
        />
        <div className="work-list">
          <ListingList fetchStatus={this.props.workState.status}>
            {libraryEntryWorkList}
          </ListingList>
          <Navigator
            count={count}
            pagination={pagination}
            names={{
              singular: `${workType.name.toLowerCase()} found`,
              plural: `${workType.name_plural.toLowerCase()} found`,
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

WorkList = withSearchParams(
  withParams(
    connect(mapStateToProps, {
      loadLibraryEntries,
    })(WorkList)
  )
)

export default WorkList
