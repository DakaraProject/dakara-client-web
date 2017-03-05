import React from 'react'
import Song from './Song'

const SongsList = ({ songs }) => (
  <ul>
    {songs.map(song =>
      <Song
        key={song.id}
        song={song}
      />
    )}
  </ul>
)

export default SongsList
