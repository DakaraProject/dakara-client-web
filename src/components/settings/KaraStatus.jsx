import { useSelector } from 'react-redux'

import { CheckboxField, FormBlock } from 'components/generics/Form'
import { isPlaylistManager } from 'permissions/playlist'
import { Status } from 'reducers/alterationsResponse'

export default function KaraStatus() {
  const karaokeState = useSelector((state) => state.playlist.karaoke)
  const user = useSelector((state) => state.authenticatedUser)

  // render nothing if the kara status is being fetched
  if (karaokeState.status === Status.pending || karaokeState.Status === null)
    return null

  const { data: karaoke } = karaokeState
  const isManager = isPlaylistManager(user)

  let karaStatusWidget
  if (isManager) {
    karaStatusWidget = (
      <FormBlock
        title="Edit kara status"
        action="playlist/karaoke/"
        method="PUT"
        submitText="Set"
        alterationName="editKaraStatus"
        successMessage="Kara status sucessfully updated!"
        noClearOnSuccess
      >
        <CheckboxField
          id="ongoing"
          defaultValue={karaoke.ongoing}
          label="Ongoing"
        />
        <CheckboxField
          id="can_add_to_playlist"
          defaultValue={karaoke.can_add_to_playlist}
          label="Can add to playlist"
          disabledBy="ongoing"
        />
        <CheckboxField
          id="player_play_next_song"
          defaultValue={karaoke.player_play_next_song}
          label="Player play next song"
          disabledBy="ongoing"
        />
      </FormBlock>
    )
  } else {
    if (!karaoke.ongoing) {
      karaStatusWidget = (
        <p>
          Karaoke is not ongoing. The player is stopped, the playlist is empty
          and you can&apos;t add songs to it.
        </p>
      )
    } else {
      karaStatusWidget = []
      if (karaoke.player_play_next_song) {
        karaStatusWidget.push(<p>The player plays songs in the playlist.</p>)
      } else {
        karaStatusWidget.push(
          <p>
            No additional song is played by the player, which finishes playing
            its current song if any.
          </p>
        )
      }

      if (karaoke.can_add_to_playlist) {
        karaStatusWidget.push(<p>Songs can be added to the playlist.</p>)
      } else {
        karaStatusWidget.push(<p>Songs can&apos;t be added to the playlist.</p>)
      }
    }
  }

  return (
    <div id="kara-status" className="flow">
      {karaStatusWidget}
    </div>
  )
}
