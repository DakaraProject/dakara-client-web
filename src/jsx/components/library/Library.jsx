import React, { Component } from 'react'
import { connect } from 'react-redux'
import { parse, stringify } from 'query-string'
import { NavLink, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { loadWorkTypes } from 'actions'
import Paginator from 'components/generics/Paginator'
import ListWrapper from './ListWrapper'

class Library extends Component {
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
        const newSearch = parse(this.props.location.search).search
        if (newSearch != parse(prevProps.location.search).search && newSearch ) {
            this.updateQueryFromLocation()
        }
    }

    updateQueryFromLocation = () => {
        const query = parse(this.props.location.search).search || ''
        this.setState({query})
    }

    getLibraryNameInfo = () => {
        return this.props.nameInfo
    }

    getLibraryEntries = () => {
        const entries = this.props.entries
        if (entries && entries.data)
        return entries
    }

    render() {
        const workTypes = this.props.library.workTypes
        if (!workTypes.hasFetched) {
            return null
        }

        // library name
        const libraryNameInfo = this.getLibraryNameInfo()

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
                                name={workType.name_plural}
                            />
                           )
        })

        // counter
        let infoCounter
        if (libraryNameInfo) {
            infoCounter = (
                <div className="counter">
                    <span className="figure">{entriesCount}</span>
                    <span className="text">{entriesCount == 1 ? libraryNameInfo.singular : libraryNameInfo.plural} found</span>
                </div>
            )
        }

        return (
            <div id="library" className="box">
                <nav className="tab-bar library-chooser">
                    <LibraryTab
                        queryName="song"
                        iconName="bars"
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
                        this.context.router.history.push({
                            pathname,
                            search: stringify({search: this.state.query})
                        })
                    }}
                >
                    <div className="set">
                        <div className="field">
                            <div className="text-input input fake" id="library-searchbox-fake">
                                <input
                                    className="faked"
                                    placeholder={libraryNameInfo.placeholder}
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
                                            this.context.router.history.push({pathname})
                                        }
                                    }>
                                        <span className="icon">
                                            <i className="fa fa-times"></i>
                                        </span>
                                    </div>
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

                <ListWrapper
                    isFetching={isFetching}
                    fetchError={fetchError}
                >
                    {this.props.children}
                </ListWrapper>

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
        const { name, extraClassName, iconName, queryName } = this.props
        let tabName
        if (name) {
            tabName = (
                <span className="name">
                    {name}
                </span>
            )
        }

        // classes
        const linkClass = classNames(
            'tab',
            extraClassName
        )

        return (
                <NavLink
                    to={`/library/${queryName}`}
                    className={linkClass}
                    activeClassName="active"
                >
                    <span className="icon">
                        <i className={`fa fa-${iconName}`}></i>
                    </span>
                    {tabName}
                </NavLink>
                )
    }
}

Library.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired
    })
}

const mapStateToProps = (state) => ({
    library: state.library,
})

Library = withRouter(connect(
    mapStateToProps,
    { loadWorkTypes }
)(Library))

export default Library
