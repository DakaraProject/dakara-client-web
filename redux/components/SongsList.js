import React, { Component } from 'react'
import Song from './Song'

class SongsList extends Component {
    componentWillMount() {
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
            this.props.loadSongs("songs", {pageNumber})
        } else {
            this.props.loadSongs("songs")
        }
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
