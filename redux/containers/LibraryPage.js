import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import { loadWorkTypes } from '../actions'

class LibraryTab extends Component {
    render() {
        const props = this.props
        let tabName
        if (props.name) {
            tabName = (
                        <span className="tab-name">
                            {props.name}
                        </span>
                    )
        }
        return (
                <Link
                    to={"/library/" + props.queryName }
                    className={"library-tab " + (props.extraClassName || "")}
                    activeClassName="active"
                >
                    <span className="tab-icon">
                        <i className={"fa fa-" + props.iconName}></i>
                    </span>
                    {tabName}
                </Link>
                )
    }
}

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
        const workTypesTabs = this.props.workTypes.map(function(workType) {
                    return (
                            <LibraryTab
                                queryName={workType.query_name}
                                iconName={workType.icon_name}
                                name={workType.name + "s"}
                            />
                           )
        })

        return (
            <div id="libraries">
                <nav id="library-chooser">
                    <LibraryTab
                        queryName="song"
                        iconName="home"
                        extraClassName="library-tab-home"
                    />
                    <LibraryTab
                        queryName="artist"
                        iconName="music"
                        name="Artists"
                    />
                    {workTypesTabs}
                </nav>



                <form id="library-searchbox" onSubmit={e => {
                    e.preventDefault()
                    browserHistory.push({pathname, query: {search: query.value}})
                }}>
                    <div className="field">
                        <div className="fake-input">
                            <input
                                ref={node => {
                                    query = node
                                }}
                                defaultValue={queryFromUrl || ''}
                                placeholder="Type something here..."
                            />
                            <div className="controls">
                                <div className="clear control" onClick={e => {
                                        query.value = ""
                                        browserHistory.push({pathname})
                                    }
                                }>
                                    <i className="fa fa-times"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="controls">
                        <button type="submit" className="search control primary">
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </form>

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
