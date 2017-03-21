import React, { Component } from 'react'
import Song from './Song'

class SongsList extends Component {
    componentWillMount() {
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

        this.props.loadSongs("songs", args)
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
