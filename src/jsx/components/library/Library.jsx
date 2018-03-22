import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LibraryTabList from './LibraryTabList'
import SearchBox from './SearchBox'
import { workTypeLibraryPropType } from 'reducers/library'

class Library extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        workTypeLibrary: workTypeLibraryPropType.isRequired,
        nameInfo: PropTypes.shape({
            placeholder: PropTypes.string.isRequired,
        }).isRequired
    }

    render() {
        const { location, workTypeLibrary, nameInfo } = this.props

        return (
            <div id="library" className="box">
                <LibraryTabList
                    workTypeLibrary={workTypeLibrary}
                />

                <SearchBox
                    placeholder={nameInfo.placeholder}
                    location={location}
                />

                {this.props.children}
            </div>
        )
    }
}

export default Library
