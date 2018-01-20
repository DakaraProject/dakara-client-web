import React, { Component } from 'react'
import LibraryTabList from './LibraryTabList'
import SearchBox from './SearchBox'

class Library extends Component {
    render() {
        const location = this.props.location
        const workTypes = this.props.workTypes

        const libraryNameInfo = this.props.nameInfo

        return (
            <div id="library" className="box">
                <LibraryTabList
                    workTypes={workTypes}
                />

                <SearchBox
                    placeholder={libraryNameInfo.placeholder}
                    location={location}
                />

                {this.props.children}
            </div>
        )
    }
}

export default Library
