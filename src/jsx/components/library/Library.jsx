import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LibraryTabList from './LibraryTabList'
import SearchBox from './SearchBox'

class Library extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        workTypes: PropTypes.object.isRequired,
        nameInfo: PropTypes.shape({
            placeholder: PropTypes.string.isRequired,
        }).isRequired
    }

    render() {
        const { location, workTypes, nameInfo } = this.props

        return (
            <div id="library" className="box">
                <LibraryTabList
                    workTypes={workTypes}
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
