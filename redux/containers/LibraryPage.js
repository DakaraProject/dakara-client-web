import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import { loadWorkTypes } from '../actions'
import Paginator from '../components/Paginator'

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
                return `What ${libraryName} do you want?`
        }
    }

    render() {
        // you MUST provide the current `pathname`, otherwize (when providing
        // only `query`) it is undefined
        const pathname = this.props.location.pathname

        // info bar
        const entriesCount = this.props.entriesCount

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
                <div className="counter">
                    <span className="figure">{entriesCount}</span>
                    <span className="text">{libraryName}{entriesCount == 1? '': 's'} found</span>
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
                                    <i className="fa fa-times"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="controls">
                        <button type="submit" className="control primary">
                            <i className="icon fa fa-search"></i>
                        </button>
                    </div>
                </form>

                {this.props.children}

                <div className="library-navigator">
                    <Paginator
                        location={this.props.location}
                        current={this.props.currentPageNumber}
                        last={this.props.lastPageNumber}
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
