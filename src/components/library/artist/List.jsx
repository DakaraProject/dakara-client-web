import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useOutletContext, useSearchParams } from 'react-router'

import { loadLibraryEntries } from 'actions/library'
import ListingList from 'components/generics/listing/List'
import Navigator from 'components/generics/Navigator'
import SearchBox from 'components/generics/SearchBox'
import ArtistEntry from 'components/library/artist/Entry'

export default function ArtistList() {
  const artistState = useSelector((state) => state.library.artist)

  const dispatch = useDispatch()

  const [searchBoxQuery, setSearchBoxQuery] = useOutletContext()

  const [searchParams, _] = useSearchParams()

  const page = searchParams.get('page')
  const query = searchParams.get('query')
  useEffect(
    () => {
      // refresh immediately, or if moved to a different page, or if the search query
      // changed
      dispatch(loadLibraryEntries('artists', page, query))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, query]
  )

  const { artists, query: queryParsed, count, pagination } = artistState.data

  // ArtistEntry for each artist
  const libraryEntryArtistList = artists.map((artist) => (
    <ArtistEntry key={artist.id} artist={artist} query={queryParsed} />
  ))

  return (
    <div id="artist-library">
      <SearchBox
        placeholder="Who are you looking for?"
        query={searchBoxQuery}
        setQuery={setSearchBoxQuery}
        help={{
          example: 'artist',
        }}
      />
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
