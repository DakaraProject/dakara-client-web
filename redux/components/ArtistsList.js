import React, { Component } from 'react'
import Artist from './Artist'

class ArtistsList extends Component {
    componentDidMount() {
        this.props.loadArtists("artists")
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
