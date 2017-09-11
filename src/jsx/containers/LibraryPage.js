import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import { loadWorkTypes } from '../actions'
import Paginator from '../components/Paginator'
import LibraryListWrapper from '../components/LibraryListWrapper'

class LibraryPage extends Component {
    state = {
        query: ""
    }

    componentWillMount() {
        this.props.loadWorkTypes()
    }

    componentDidMount() {
        this.updateQueryFromLocation()
    }

    componentDidUpdate(prevProps) {
        const newSearch = this.props.location.query.search
        if (newSearch != prevProps.location.query.search && newSearch ) {
            this.updateQueryFromLocation()
        }
    }

    updateQueryFromLocation = () => {
        const query = this.props.location.query.search || ''
        this.setState({query})
    }

    getLibraryName = () => {
        const libraryComponentName = this.props.children.type.WrappedComponent.getName()
        switch (libraryComponentName) {
            case 'LibraryListSong':
                return "song"

            case 'LibraryListArtist':
                return "artist"

            case 'LibraryListWork':
                const workTypeQueryName = this.props.children.props.params.workType
                const workTypes = this.props.library.workTypes.data.results
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
                return `What ${libraryName} do you want?`
        }
    }

    getLibraryEntries = () => {
        const libraryComponentName = this.props.children.type.WrappedComponent.getName()
        console.log("Hopefully I can find this")
        switch (libraryComponentName) {
            case 'LibraryListSong':
                return this.props.library.song

            case 'LibraryListArtist':
                return this.props.library.artist

            case 'LibraryListWork':
                const workTypeQueryName = this.props.children.props.params.workType
                return this.props.library.work[workTypeQueryName]
        }
    }

    render() {
        const workTypes = this.props.library.workTypes
        if (!workTypes.hasFetched) {
            return null
        }

        // library name
        const libraryName = this.getLibraryName()
        const libraryPlaceholder = this.getLibraryPlaceholder(libraryName)

        const libraryEntriesDefault = {
            data: {current: 1, last: 1, count: 0},
            isFetching: false,
            fetchError: false
        }

        const libraryEntries = this.getLibraryEntries() || libraryEntriesDefault

        const {
            current: currentPageNumber,
            last: lastPageNumber,
            count: entriesCount
        } = libraryEntries.data

        const { isFetching, fetchError } = libraryEntries

        // you MUST provide the current `pathname`, otherwize (when providing
        // only `query`) it is undefined
        const pathname = this.props.location.pathname

        // Work Types links
        const workTypesTabs = workTypes.data.results.map(function(workType) {
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
                <div className="counter">
                    <span className="figure">{entriesCount}</span>
                    <span className="text">{libraryName}{entriesCount == 1 ? '': 's'} found</span>
                </div>
            )
        }

        return (
            <div id="library" className="box">
                <nav className="library-chooser">
                    <LibraryTab
                        queryName="song"
                        iconName="home"
                        extraClassName="home"
                    />
                    <LibraryTab
                        queryName="artist"
                        iconName="music"
                        name="Artists"
                    />
                    {workTypesTabs}
                </nav>

                <form
                    className="form inline library-searchbox"
                    onSubmit={e => {
                        e.preventDefault()
                        browserHistory.push({pathname, query: {search: this.state.query}})
                    }}
                >
                    <div className="set">
                        <div className="input fake" id="library-searchbox-fake">
                            <input
                                className="faked"
                                placeholder={libraryPlaceholder}
                                value={this.state.query}
                                onChange={e => this.setState({query: e.target.value})}
                                onFocus={() => {
                                    document.getElementById(
                                        'library-searchbox-fake'
                                    ).classList.add(
                                        'focus'
                                    )
                                }}
                                onBlur={() => {
                                    document.getElementById(
                                        'library-searchbox-fake'
                                    ).classList.remove(
                                        'focus'
                                    )
                                }}
                            />
                            <div className="controls">
                                <div className="control" onClick={e => {
                                        this.setState({query: ""})
                                        browserHistory.push({pathname})
                                    }
                                }>
                                    <span className="icon">
                                        <i className="fa fa-times"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="controls">
                        <button type="submit" className="control primary">
                            <span className="icon">
                                <i className="fa fa-search"></i>
                            </span>
                        </button>
                    </div>
                </form>

                <LibraryListWrapper
                    isFetching={isFetching}
                    fetchError={fetchError}
                >
                    {this.props.children}
                </LibraryListWrapper>

                <div className="library-navigator">
                    <Paginator
                        location={this.props.location}
                        current={currentPageNumber}
                        last={lastPageNumber}
                    />
                    {infoCounter}
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
                        <span className="name">
                            {props.name}
                        </span>
                    )
        }

        return (
                <Link
                    to={"/library/" + props.queryName }
                    className={"tab " + (props.extraClassName || "")}
                    activeClassName="active"
                >
                    <span className="icon">
                        <i className={"fa fa-" + props.iconName}></i>
                    </span>
                    {tabName}
                </Link>
                )
    }
}

const mapStateToProps = (state) => ({
    library: state.library,
})

LibraryPage = connect(
    mapStateToProps,
    { loadWorkTypes }
)(LibraryPage)

export default LibraryPage
