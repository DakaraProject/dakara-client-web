import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import SongsPageList from './SongsPageList'
import { loadWorkTypes } from '../actions'

class LibraryPage extends Component {
    componentWillMount() {
        this.props.loadWorkTypes()
    }

    render() {

        // you MUST provide the current `pathname`, otherwize (when providing
        // only `query`) it is undefined
        const pathname = this.props.location.pathname

        // paginator
        const currentPageNumber = this.props.currentPageNumber
        const lastPageNumber = this.props.lastPageNumber
        const entriesCount = this.props.entriesCount

        // search bar
        const queryFromUrl = this.props.location.query.search
        let query

        // Work Types links
        const workTypesLinks = this.props.workTypes.map(function(workType) {
                    return (
                            <li>
                                <Link
                                    to={"/library/"+workType.query_name+"s"}
                                    activeStyle={{ color: 'red' }}
                                >
                                    {workType.name+"s"}
                                </Link>
                            </li>
                           )
        })

        return (
            <div>
                <form onSubmit={e => {
                    e.preventDefault()
                    browserHistory.push({pathname, query: {search: query.value}})
                }}>
                    <input ref={node => {
                        query = node
                    }} defaultValue={queryFromUrl || ''} />
                    <button type="submit">
                        Search
                    </button>
                </form>
                <ul>
                    <li><Link to="/library/songs" activeStyle={{ color: 'red' }}>Songs</Link></li>
                    <li><Link to="/library/artists" activeStyle={{ color: 'red' }}>Artists</Link></li>
                    {workTypesLinks}

                </ul>
                {this.props.children}
                <nav>
                    <Link to={{pathname, query: {...this.props.location.query, page: 1}}}>First</Link>
                    <Link to={{pathname, query: {...this.props.location.query, page: currentPageNumber - 1}}}>Previous</Link>
                    <Link to={{pathname, query: {...this.props.location.query, page: currentPageNumber + 1}}}>Next</Link>
                    <Link to={{pathname, query: {...this.props.location.query, page: lastPageNumber}}}>Last</Link>
                    {entriesCount} entries
                </nav>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentPageNumber: state.library.entries.current,
    entriesCount: state.library.entries.count,
    lastPageNumber: state.library.entries.last,
    workTypes: state.library.workTypes.results
})

LibraryPage = connect(
    mapStateToProps,
    { loadWorkTypes }
)(LibraryPage)

export default LibraryPage
