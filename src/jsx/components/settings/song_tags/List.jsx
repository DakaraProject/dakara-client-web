import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { parse } from 'query-string'
import PropTypes from 'prop-types'
import { getSongTagList, editSongTag, clearTagListEntryNotification } from 'actions/songTags'
import Navigator from 'components/generics/Navigator'
import SettingsSongTagsEntry from './Entry'
import SettingsTabList from '../TabList'
import { songTagsStatePropType } from 'reducers/songTags'
import { alterationResponsePropType } from 'reducers/alterationsResponse'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'

class SettingsSongTagsList extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        songTagsState: songTagsStatePropType.isRequired,
        responseOfMultipleEdit: PropTypes.objectOf(alterationResponsePropType),
        responseOfMultipleEditColor: PropTypes.objectOf(alterationResponsePropType),
        editSongTag: PropTypes.func.isRequired,
        getSongTagList: PropTypes.func.isRequired,
        clearTagListEntryNotification: PropTypes.func.isRequired,
    }

    componentWillMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        const queryObj = parse(this.props.location.search)
        const prevqueryObj = parse(prevProps.location.search)
        if (queryObj.page != prevqueryObj.page) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        const queryObj = parse(this.props.location.search)
        const pageNumber = queryObj.page
        this.props.getSongTagList(pageNumber)
    }

    render() {
        const { editSongTag, clearTagListEntryNotification, location,
            responseOfMultipleEdit, responseOfMultipleEditColor } = this.props
        const { songTags, pagination } = this.props.songTagsState.data

        const tagList = songTags.map((tag) => (
            <SettingsSongTagsEntry
                key={tag.id}
                tag={tag}
                responseOfEdit={responseOfMultipleEdit[tag.id]}
                responseOfEditColor={responseOfMultipleEditColor[tag.id]}
                editSongTag={editSongTag}
                clearTagListEntryNotification={clearTagListEntryNotification}
            />
        ))

        return (
            <div className="box" id="song-tag-list">
                <SettingsTabList/>
                <ListingFetchWrapper
                    status={this.props.songTagsState.status}
                >
                    <div className="listing-table-container">
                        <table className="listing song-tag-list-listing notifiable">
                            <thead>
                                <tr className="listing-header">
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
    responseOfMultipleEditColor: state.alterationsResponse.multiple.editSongTagColor || {},
})

SettingsSongTagsList = withRouter(connect(
    mapStateToProps,
    {
        getSongTagList,
        editSongTag,
        clearTagListEntryNotification
    }
)(SettingsSongTagsList))

export default SettingsSongTagsList
