import PropTypes from 'prop-types'
import { parse } from 'query-string'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { clearAlteration } from 'actions/alterations'
import { editSongTag, getSongTagList } from 'actions/songTags'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import { withLocation } from "components/generics/Router"
import SettingsSongTagsEntry from 'components/settings/songTags/Entry'
import { alterationResponsePropType } from 'reducers/alterationsResponse'
import { songTagsStatePropType } from 'reducers/songTags'
import { userPropType } from 'serverPropTypes/users'

class SongTagsList extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        songTagsState: songTagsStatePropType.isRequired,
        responseOfMultipleEdit: PropTypes.objectOf(alterationResponsePropType),
        responseOfMultipleEditColor: PropTypes.objectOf(alterationResponsePropType),
        editSongTag: PropTypes.func.isRequired,
        getSongTagList: PropTypes.func.isRequired,
        clearAlteration: PropTypes.func.isRequired,
        authenticatedUser: userPropType.isRequired,
    }

    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        const queryObj = parse(this.props.location.search)
        const prevqueryObj = parse(prevProps.location.search)
        if (queryObj.page !== prevqueryObj.page) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        const queryObj = parse(this.props.location.search)
        const pageNumber = queryObj.page
        this.props.getSongTagList(pageNumber)
    }

    render() {
        const { editSongTag, clearAlteration, location, authenticatedUser,
            responseOfMultipleEdit, responseOfMultipleEditColor } = this.props
        const { songTags, pagination } = this.props.songTagsState.data

        const tagList = songTags.map((tag) => (
            <SettingsSongTagsEntry
                key={tag.id}
                tag={tag}
                responseOfEdit={responseOfMultipleEdit[tag.id]}
                responseOfEditColor={responseOfMultipleEditColor[tag.id]}
                editSongTag={editSongTag}
                clearAlteration={clearAlteration}
                authenticatedUser={authenticatedUser}
            />
        ))

        return (
            <div id="song-tag-list">
                <ListingFetchWrapper
                    status={this.props.songTagsState.status}
                >
                    <div className="listing-table-container">
                        <table className="listing song-tag-list-listing">
                            <thead>
                                <tr className="listing-header">
                                    <th className="notification-col"></th>
                                    <th className="name">Name</th>
                                    <th className="enabled">Enabled</th>
                                    <th className="color">Color</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tagList}
                            </tbody>
                        </table>
                    </div>
                </ListingFetchWrapper>
                <Navigator
                    pagination={pagination}
                    location={location}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    songTagsState: state.settings.songTags,
    responseOfMultipleEdit: state.alterationsResponse.multiple.editSongTag || {},
    // eslint-disable-next-line max-len
    responseOfMultipleEditColor: state.alterationsResponse.multiple.editSongTagColor || {},
    authenticatedUser: state.authenticatedUser,
})

SongTagsList = withLocation(connect(
    mapStateToProps,
    {
        getSongTagList,
        editSongTag,
        clearAlteration
    }
)(SongTagsList))

export default SongTagsList
