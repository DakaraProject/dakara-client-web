import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'

import { loadLibraryEntries } from 'actions/library'
import ListingList from 'components/generics/listing/List'
import Navigator from 'components/generics/Navigator'
import ArtistEntry from 'components/library/artist/Entry'
import SearchBox from 'components/library/SearchBox'

export default function ArtistList() {
  const artistState = useSelector((state) => state.library.artist)

  const [searchParams, _] = useSearchParams()
  const dispatch = useDispatch()

  const page = searchParams.get('page')
  const query = searchParams.get('query')
  useEffect(() => {
    // refresh immediately, or if moved to a different page, or if the search query
    // changed
    dispatch(
      loadLibraryEntries('artists', {
        page,
        query,
      })
    )
  }, [page, query, dispatch])

  const { artists, query: queryParsed, count, pagination } = artistState.data

  // ArtistEntry for each artist
  const libraryEntryArtistList = artists.map((artist) => (
    <ArtistEntry key={artist.id} artist={artist} query={queryParsed} />
  ))

  return (
    <div id="artist-library">
      <SearchBox placeholder="Who are you looking for?" />
      <ListingList fetchStatus={artistState.status} noTransition>
        {libraryEntryArtistList}
      </ListingList>
      <Navigator
        count={count}
        pagination={pagination}
        names={{
          singular: 'artist',
          plural: 'artists',
        }}
      />
    </div>
  )
}
