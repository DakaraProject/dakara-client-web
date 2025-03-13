import UserWidget from 'components/generics/UserWidget'
import { playlistEntryPropType } from 'serverPropTypes/playlist'

const PlaylistEntryMinimal = (props) => (
  <div className="playlist-entry-minimal">
    <div className="title">{props.playlistEntry.song.title}</div>
    <UserWidget user={props.playlistEntry.owner} />
  </div>
)
PlaylistEntryMinimal.propTypes = {
  playlistEntry: playlistEntryPropType.isRequired,
}

export default PlaylistEntryMinimal
