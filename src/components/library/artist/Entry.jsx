import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'

import { ListingEntry } from 'components/generics/listing/Entry'
import ArtistWidget from 'components/library/widgets/Artist'
import { artistPropType } from 'serverPropTypes/library'
import { withNavigate } from 'thirdpartyExtensions/ReactRouterDom'

class ArtistEntry extends Component {
  static propTypes = {
    artist: artistPropType.isRequired,
    navigate: PropTypes.func.isRequired,
    query: PropTypes.object,
  }

  /**
   * Search songs associated with the artist
   */
  handleSearch = () => {
    const newQuery = `artist:""${this.props.artist.name}""`
    this.props.navigate({
      pathname: '/library/song',
      search: queryString.stringify({ query: newQuery }),
    })
  }

  render() {
    const { artist, query } = this.props

    const controls = (
      <button className="control square primary" onClick={this.handleSearch}>
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
}

ArtistEntry = withNavigate(ArtistEntry)

export default ArtistEntry
