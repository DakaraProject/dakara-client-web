import PropTypes from 'prop-types'
import queryString from 'query-string'
import { useNavigate } from 'react-router'

import { ListingEntry } from 'components/generics/listing/Entry'
import ArtistWidget from 'components/library/widgets/Artist'
import { artistPropType } from 'serverPropTypes/library'

export default function ArtistEntry({ artist, query }) {
  const navigate = useNavigate()

  const controls = (
    <button
      className="control square primary"
      onClick={() => {
        // search songs associated to the artist
        navigate({
          pathname: '/library/song',
          search: queryString.stringify({ query: `artist:""${artist.name}""` }),
        })
      }}
    >
      <span className="icon">
        <i className="las la-search"></i>
      </span>
    </button>
  )

  return (
    <ListingEntry id={artist.id} controls={controls}>
      <ArtistWidget artist={artist} query={query} noIcon truncatable />
    </ListingEntry>
  )
}

ArtistEntry.propTypes = {
  artist: artistPropType.isRequired,
  query: PropTypes.object,
}
