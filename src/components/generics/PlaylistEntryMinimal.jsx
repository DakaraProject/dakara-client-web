import UserWidget from 'components/generics/UserWidget'

const PlaylistEntryMinimal = (props) => (
    <div className="playlist-entry-minimal">
        <div className="title">
            {props.playlistEntry.song.title}
        </div>
        <UserWidget user={props.playlistEntry.owner}/>
    </div>
)

export default PlaylistEntryMinimal
