import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import classNames from 'classnames'
import Paginator from 'components/generics/Paginator'
import ListWrapper from './ListWrapper'
import SearchBox from './SearchBox'

class Library extends Component {
    render() {
        const workTypes = this.props.workTypes

        // library name
        const libraryNameInfo = this.props.nameInfo

        const entries = this.props.entries

        let libraryEntries
        if (entries && entries.data) {
            libraryEntries = entries
        } else {
            libraryEntries = {
                data: {current: 1, last: 1, count: 0},
                isFetching: false,
                fetchError: false
            }
        }

        const {
            current: currentPageNumber,
            last: lastPageNumber,
            count: entriesCount
        } = libraryEntries.data

        const { isFetching, fetchError } = libraryEntries

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

                <SearchBox
                    placeholder={libraryNameInfo.placeholder}
                    location={location}
                />

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

export default Library
