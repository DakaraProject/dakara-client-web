import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'

import { getSongTagList } from 'actions/songTags'
import ListingFetchWrapper from 'components/generics/listing/FetchWrapper'
import Navigator from 'components/generics/Navigator'
import SettingsSongTagsEntry from 'components/settings/songTags/Entry'
import { useIsLibraryManager } from 'permissions/library'
import { Status } from 'reducers/alterationsResponse'

export default function SongTagsList() {
  const songTagsState = useSelector((state) => state.settings.songTags)
  const user = useSelector((state) => state.authenticatedUser)
  const { status: songTagsStatus } = songTagsState

  const [searchParams, _] = useSearchParams()
  const { page } = Object.fromEntries(searchParams.entries())

  const dispatch = useDispatch()

  const isLibraryManager = useIsLibraryManager()

  useEffect(
    () => {
      // refresh song tags immediately and if the page changes
      if (songTagsStatus !== Status.pending) {
        dispatch(getSongTagList(page))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page]
  )

  const { songTags, pagination } = songTagsState.data

  const tagList = songTags.map((tag) => (
    <SettingsSongTagsEntry
      key={tag.id}
      tag={tag}
      editable={isLibraryManager(user)}
    />
  ))

  return (
    <div id="song-tag-list">
      <ListingFetchWrapper status={songTagsState.status}>
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
