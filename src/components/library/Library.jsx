import PropTypes from 'prop-types'
import React, { Component } from 'react'

import LibraryTabList from 'components/library/LibraryTabList'
import SearchBox from 'components/library/SearchBox'
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
                    <LibraryTabList
                        workTypeState={workTypeState}
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
