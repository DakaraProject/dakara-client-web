import React, { Component } from 'react'
import LibraryTabList from './LibraryTabList'
import SearchBox from './SearchBox'
import ListWrapper from './ListWrapper'
import Paginator from 'components/generics/Paginator'


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
                <LibraryTabList
                    workTypes={workTypes}
                />

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
