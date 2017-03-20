import React, { Component } from 'react'
import Song from './Song'

class SongsList extends Component {
    componentWillMount() {
        this.props.loadSongs("songs")
    }

    render() {
        const songs = this.props.songs
        return (
              <ul>
                {songs.map(song =>
                  <Song
                    key={song.id}
                    song={song}
                  />
                )}
              </ul>
              )
    }
}

export default SongsList
