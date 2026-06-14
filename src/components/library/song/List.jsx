import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useOutletContext, useSearchParams } from 'react-router'

import { loadLibraryEntries } from 'actions/library'
import ListingList from 'components/generics/listing/List'
import Navigator from 'components/generics/Navigator'
import SearchBox from 'components/generics/SearchBox'
import SongEntry from 'components/library/song/Entry'

export default function SongList() {
  const songState = useSelector((state) => state.library.song)
  const playlistDateEnd = useSelector(
    (state) => state.playlist.digest.entries.data.dateEnd
  )
  const karaokeState = useSelector((state) => state.playlist.karaoke)

  const dispatch = useDispatch()

  const [searchBoxQuery, setSearchBoxQuery] = useOutletContext()

  const [searchParams, _] = useSearchParams()

  const { page, query } = Object.fromEntries(searchParams.entries())

  useEffect(
    () => {
      // fetch songs from server immediately, and if the page or if the query changes
      dispatch(loadLibraryEntries('songs', page, query))
      setSearchBoxQuery(query || '')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, query]
  )

  const { songs, count, pagination } = songState.data
  const { date_stop: karaokeDateStop } = karaokeState.data

  // compute remaining karoke time
  let karaokeRemainingSeconds
  if (karaokeDateStop) {
    karaokeRemainingSeconds = dayjs(karaokeDateStop).diff(
      playlistDateEnd,
      'seconds'
    )
  }

  // create SongEntry for each song
  const libraryEntrySongList = songs.map((song) => (
    <SongEntry
      key={song.id}
      song={song}
      karaokeRemainingSeconds={karaokeRemainingSeconds}
    />
  ))

  return (
    <div id="song-library">
      <SearchBox
        placeholder="What will you sing?"
        query={searchBoxQuery}
        setQuery={setSearchBoxQuery}
        help={{
          example: 'title',
          fields: 'title, artist, work',
          withHash: true,
        }}
      />
      <ListingList
        entries={libraryEntrySongList}
        fetchStatus={songState.status}
        noTransition
      />
      <Navigator
        count={count}
        pagination={pagination}
        names={{
          singular: 'song',
          plural: 'songs',
        }}
      />
    </div>
  )
}
