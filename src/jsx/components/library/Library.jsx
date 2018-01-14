import React, { Component } from 'react'
import Paginator from 'components/generics/Paginator'
import ListWrapper from './ListWrapper'
import SearchBox from './SearchBox'
import LibraryTab from './LibraryTab'

class Library extends Component {
    render() {
        const workTypes = this.props.workTypes

        // library name
        const libraryNameInfo = this.props.nameInfo

        const entries = this.props.entries

        if (!entries || !entries.data) {
            return null
        }

        const libraryEntries = entries

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

export default Library
