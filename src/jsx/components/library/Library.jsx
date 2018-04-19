import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LibraryTabList from './LibraryTabList'
import SearchBox from './SearchBox'
import { workTypeStatePropType } from 'reducers/library'

class Library extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        workTypeState: workTypeStatePropType.isRequired,
        nameInfo: PropTypes.shape({
            placeholder: PropTypes.string.isRequired,
        }).isRequired
    }

    render() {
        const { location, workTypeState, nameInfo } = this.props

        return (
            <div id="library" className="box">
                <div class="library-header">
                    <LibraryTabList
                        workTypeState={workTypeState}
                    />

                    <SearchBox
                        placeholder={nameInfo.placeholder}
                        location={location}
                    />
                </div>
                {this.props.children}
            </div>
        )
    }
}

export default Library
