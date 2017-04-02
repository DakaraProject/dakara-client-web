import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import { loadWorkTypes } from '../actions'
import Paginator from '../components/Paginator'

class LibraryPage extends Component {
    componentWillMount() {
        this.props.loadWorkTypes()
    }

    getLibraryName = () => {
        const libraryComponentName = this.props.children.type.WrappedComponent.name
        switch (libraryComponentName) {
            case 'LibraryListSong':
                return "song"

            case 'LibraryListArtist':
                return "artist"

            case 'LibraryListWork':
                const workTypeQueryName = this.props.children.props.params.workType
                const workTypes = this.props.workTypes
                const workType = workTypes.find(
                    (workType) => workType.query_name == workTypeQueryName
                )

                if (!workType) {
                    return ""
                }

                return workType.name.toLowerCase()
        }
    }

    getLibraryPlaceholder = (libraryName) => {
        if (!libraryName) {
            return ""
        }

        switch (libraryName) {
            case "song":
                return "What will you sing?"

            case "artist":
                return "Who are you looking for?"

            default:
                return `What ${libraryName} do you want`
        }
    }

    render() {
        // you MUST provide the current `pathname`, otherwize (when providing
        // only `query`) it is undefined
        const pathname = this.props.location.pathname

        // info bar
        const entriesCount = this.props.entriesCount

        // search bar
        const queryFromUrl = this.props.location.query.search
        let query

        // library name
        const libraryName = this.getLibraryName()
        const libraryPlaceholder = this.getLibraryPlaceholder(libraryName)

        // Work Types links
        const workTypesTabs = this.props.workTypes.map(function(workType) {
                    return (
                            <LibraryTab
                                key={workType.query_name}
                                queryName={workType.query_name}
                                iconName={workType.icon_name}
                                name={workType.name + "s"}
                            />
                           )
        })

        // counter
        let infoCounter
        if (libraryName) {
            infoCounter = (
                <div className="info-item" id="library-amount">
                    <span className="stat">{entriesCount}</span>
                    <span className="description">{libraryName}{entriesCount == 1? '': 's'} found</span>
                </div>
            )
        }

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
                                placeholder={libraryPlaceholder}
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

                <div id="paginator">
                    <Paginator
                        location={this.props.location}
                        current={this.props.currentPageNumber}
                        last={this.props.lastPageNumber}
                    />
                    <div className="info">
                        {infoCounter}
                    </div>
                </div>
            </div>
        )
    }
}

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
