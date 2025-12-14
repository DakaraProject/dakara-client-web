import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useOutletContext, useSearchParams } from 'react-router'

import { loadSongTags } from 'actions/songTags'
import ListingFetchWrapper from 'components/generics/listing/FetchWrapper'
import Navigator from 'components/generics/Navigator'
import SearchBox from 'components/generics/SearchBox'
import SettingsSongTagsEntry from 'components/settings/songTags/Entry'
import { isLibraryManager } from 'permissions/library'
import { Status } from 'reducers/alterationsResponse'

export default function SongTagsList() {
  const songTagsState = useSelector((state) => state.settings.songTags)
  const user = useSelector((state) => state.authenticatedUser)
  const { status: songTagsStatus } = songTagsState

  const [searchParams, _] = useSearchParams()
  const { page, query } = Object.fromEntries(searchParams.entries())

  const dispatch = useDispatch()

  const [searchBoxQuery, setSearchBoxQuery] = useOutletContext()

  useEffect(
    () => {
      // refresh song tags immediately and if the page changes
      if (songTagsStatus !== Status.pending) {
        dispatch(loadSongTags({ page, query }))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, query]
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
      <SearchBox
        placeholder="Search a song tag"
        query={searchBoxQuery}
        setQuery={setSearchBoxQuery}
        help={{
          example: 'tag',
        }}
      />
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
