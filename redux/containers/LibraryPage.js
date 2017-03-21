import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import SongsPageList from './SongsPageList'

class LibraryPage extends Component {
    render() {
        // you MUST provide the current `pathname`, otherwize (when providing
        // only `query`) it is undefined
        const pathname = this.props.location.pathname

        const currentPageNumber = this.props.currentPageNumber
        const lastPageNumber = this.props.lastPageNumber
        const entriesCount = this.props.entriesCount
        return (
            <div>
                <ul>
                    <li><Link to="/library/songs" activeStyle={{ color: 'red' }}>Songs</Link></li>
                    <li><Link to="/library/artists" activeStyle={{ color: 'red' }}>Artists</Link></li>
                    <li><Link to="/library/animes" activeStyle={{ color: 'red' }}>Animes</Link></li>
                    <li><Link to="/library/games" activeStyle={{ color: 'red' }}>Games</Link></li>
                </ul>
                {this.props.children}
                <nav>
                    <Link to={{pathname, query: {page: 1}}}>First</Link>
                    <Link to={{pathname, query: {page: currentPageNumber - 1}}}>Previous</Link>
                    <Link to={{pathname, query: {page: currentPageNumber + 1}}}>Next</Link>
                    <Link to={{pathname, query: {page: lastPageNumber}}}>Last</Link>
                    {entriesCount} entries
                </nav>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentPageNumber: state.libraryEntries.current,
    entriesCount: state.libraryEntries.count,
    lastPageNumber: state.libraryEntries.last
})

LibraryPage = connect(
    mapStateToProps
)(LibraryPage)

export default LibraryPage