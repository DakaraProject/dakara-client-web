import React, { Component } from 'react'
import Artist from './Artist'

class ArtistsList extends Component {
    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.query.page != prevProps.location.query.page ||
            this.props.location.query.search != prevProps.location.query.search) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        const pageNumber = this.props.location.query.page
        const query = this.props.location.query.search
        let args = {}

        if (pageNumber) {
            args.pageNumber = pageNumber
        }

        if (query) {
            args.query = query
        }

        this.props.loadArtists("artists", args)
    }

    render() {
        const artists = this.props.artists
        return (
              <ul>
                {artists.map(artist =>
                  <Artist
                    key={artist.id}
                    artist={artist}
                  />
                )}
              </ul>
              )
    }
}

export default ArtistsList
