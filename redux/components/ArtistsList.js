import React, { Component } from 'react'
import Artist from './Artist'

class ArtistsList extends Component {
    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.query.page != prevProps.location.query.page) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        const pageNumber = this.props.location.query.page
        if (pageNumber) {
            this.props.loadArtists("artists", pageNumber)
        } else {
            this.props.loadArtists("artists")
        }
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
