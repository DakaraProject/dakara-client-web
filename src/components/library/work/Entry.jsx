import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'

import { ListingEntry } from 'components/generics/listing/Entry'
import WorkWidget from 'components/library/widgets/Work'
import { workPropType } from 'serverPropTypes/library'
import { withNavigate } from 'thirdpartyExtensions/ReactRouterDom'

class WorkEntry extends Component {
  static propTypes = {
    work: workPropType.isRequired,
    workType: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
    query: PropTypes.object,
  }

  /**
   * Search songs associated with the work
   */
  handleSearch = () => {
    const query = `${this.props.workType}:""${this.props.work.title}""`
    this.props.navigate({
      pathname: '/library/song',
      search: queryString.stringify({ query }),
    })
  }

  render() {
    const { work, query } = this.props
    const controls = (
      <button className="control square primary" onClick={this.handleSearch}>
        <span className="icon">
          <i className="las la-search"></i>
        </span>
      </button>
    )

    return (
      <ListingEntry id={work.id} controls={controls}>
        <WorkWidget work={work} query={query} noIcon truncatable />
      </ListingEntry>
    )
  }
}

WorkEntry = withNavigate(WorkEntry)

export default WorkEntry
