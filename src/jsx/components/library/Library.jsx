import React, { Component } from 'react'
import LibraryTabList from './LibraryTabList'
import SearchBox from './SearchBox'
import ListWrapper from './ListWrapper'
import Navigator from 'components/generics/Navigator'

class Library extends Component {
    render() {
        const workTypes = this.props.workTypes

        const libraryNameInfo = this.props.nameInfo

        const entries = this.props.entries

        const { isFetching, fetchError } = entries

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

                <Navigator
                    data={entries.data}
                    names={{
                        singular: libraryNameInfo.singular + ' found',
                        plural: libraryNameInfo.plural + ' found'
                    }}
                    location={location}
                />
            </div>
        )
    }
}

export default Library
