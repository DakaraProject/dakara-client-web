import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { clearAlteration } from 'actions/alterations'
import { editSongTag, getSongTagList } from 'actions/songTags'
import ListingFetchWrapper from 'components/generics/listing/FetchWrapper'
import Navigator from 'components/generics/Navigator'
import SettingsSongTagsEntry from 'components/settings/songTags/Entry'
import { alterationResponsePropType } from 'reducers/alterationsResponse'
import { songTagsStatePropType } from 'reducers/songTags'
import { userPropType } from 'serverPropTypes/users'
import { withSearchParams } from 'thirdpartyExtensions/ReactRouterDom'

class SongTagsList extends Component {
  static propTypes = {
    authenticatedUser: userPropType.isRequired,
    clearAlteration: PropTypes.func.isRequired,
    editSongTag: PropTypes.func.isRequired,
    getSongTagList: PropTypes.func.isRequired,
    responseOfMultipleEdit: PropTypes.objectOf(alterationResponsePropType),
    responseOfMultipleEditColor: PropTypes.objectOf(alterationResponsePropType),
    songTagsState: songTagsStatePropType.isRequired,
    searchParams: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.refreshEntries()
  }

  componentDidUpdate(prevProps) {
    const { searchParams } = this.props
    const { searchParams: prevSearchParams } = prevProps

    // refresh if moved to a different page
    const page = searchParams.get('page')
    const prevPage = prevSearchParams.get('page')
    if (page !== prevPage) {
      this.refreshEntries()
    }
  }

  refreshEntries = () => {
    this.props.getSongTagList(this.props.searchParams.get('page') || 1)
  }

  render() {
    const {
      editSongTag,
      clearAlteration,
      authenticatedUser,
      responseOfMultipleEdit,
      responseOfMultipleEditColor,
    } = this.props
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
        <ListingFetchWrapper status={this.props.songTagsState.status}>
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
              <tbody>{tagList}</tbody>
            </table>
          </div>
        </ListingFetchWrapper>
        <Navigator
          count={songTags.length}
          pagination={pagination}
          names={{
            singular: 'tag',
            plural: 'tags',
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  songTagsState: state.settings.songTags,
  responseOfMultipleEdit: state.alterationsResponse.multiple.editSongTag || {},

  responseOfMultipleEditColor:
    state.alterationsResponse.multiple.editSongTagColor || {},
  authenticatedUser: state.authenticatedUser,
})

SongTagsList = withSearchParams(
  connect(mapStateToProps, {
    getSongTagList,
    editSongTag,
    clearAlteration,
  })(SongTagsList)
)

export default SongTagsList
