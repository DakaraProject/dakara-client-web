import dayjs from 'dayjs'
import queryString from 'query-string'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

import { CarouselEntry } from 'components/generics/Carousel'
import { Duration, Time, TimeRelative } from 'components/generics/Timing'
import PlaylistEntryWidget from 'components/playlist/widgets/PlaylistEntry'

export function CarouselEntryCurrentSong() {
  const { data: playerStatus } = useSelector(
    (state) => state.playlist.playerStatus
  )
  const { playlist_entry: entry, timing } = playerStatus

  if (!entry) {
    return null
  }

  return (
    <CarouselEntry className="current-song">
      <Link
        className="to-song"
        to={{
          pathname: '/library/song',
          search: queryString.stringify({
            query: `title:""${entry.song.title}""`,
            expanded: entry.song.id,
          }),
        }}
      >
        <PlaylistEntryWidget
          entry={entry}
          noRelativeDate
          songProps={{ noRelations: false }}
          truncatable
        />
      </Link>
      <div className="timer">
        <div className="current">
          <Duration duration={timing} />
        </div>
        <div className="duration">
          <Duration duration={entry.song.duration} />
        </div>
      </div>
    </CarouselEntry>
  )
}

export function CarouselEntryNextSong() {
  const { queuingEntries } = useSelector(
    (state) => state.playlist.digest.entries.data
  )

  const queuingEntryNext = queuingEntries?.[0]

  if (!queuingEntryNext) {
    return null
  }

  return (
    <CarouselEntry jumbo="Next" className="next-song">
      <Link
        className="to-song"
        to={{
          pathname: '/library/song',
          search: queryString.stringify({
            query: `title:""${queuingEntryNext.song.title}""`,
            expanded: queuingEntryNext.song.id,
          }),
        }}
      >
        <PlaylistEntryWidget entry={queuingEntryNext} truncatable />
      </Link>
    </CarouselEntry>
  )
}

export function CarouselEntryStats() {
  const {
    queuingEntries,
    playedEntries,
    dateEnd: playlistDateEnd,
  } = useSelector((state) => state.playlist.digest.entries.data)
  const { data: playerStatus } = useSelector(
    (state) => state.playlist.playerStatus
  )
  const { date_stop: karaokeDateStop } = useSelector(
    (state) => state.playlist.karaoke.data
  )
  const countPlayedEntries = playedEntries.length
  const countQueuingEntries = queuingEntries.length

  /**
   * Played songs
   */

  let playedStats
  switch (countPlayedEntries) {
    case 0:
      playedStats = <li>The karaoke has just started!</li>
      break
    case 1:
      playedStats = <li>One song played, keep going!</li>
      break
    default:
      playedStats = (
        <li>
          <q>{countPlayedEntries}</q> songs played so far
        </li>
      )
  }

  /**
   * Queuing songs
   */

  let queuingStats
  switch (countQueuingEntries) {
    case 0:
      queuingStats = <li>No songs queued in playlist yet</li>
      break
    case 1:
      queuingStats = <li>One song queued in playlist, add more!</li>
      break
    default:
      queuingStats = (
        <li>
          <q>{countQueuingEntries}</q> songs queued in playlist
        </li>
      )
  }

  /**
   * Display karaoke end or playlist end
   *
   * The code is voluntary redundant, as the different cases do not factor
   * well together. At least, the code is easy to understand.
   */

  const karaokeHasDateStop = !!karaokeDateStop

  // the playlist has a date end if a date end is calculated and either there
  // are songs queuing or there is one song playing
  const playlistHasDateEnd =
    playlistDateEnd && (countQueuingEntries || playerStatus.playlist_entry)

  let end
  // only playlist date end
  if (playlistHasDateEnd && !karaokeHasDateStop) {
    end = (
      <li>
        Playlist ends at{' '}
        <q>
          <Time iso={playlistDateEnd} />
        </q>
      </li>
    )
    // only karaoke date stop
  } else if (!playlistHasDateEnd && karaokeHasDateStop) {
    // if the the karaoke date stop is not passed
    if (dayjs().isBefore(karaokeDateStop)) {
      end = (
        <>
          <li>
            Karaoke ends at{' '}
            <q>
              <Time iso={karaokeDateStop} />
            </q>
          </li>
          <li>
            <q>
              <TimeRelative
                iso={karaokeDateStop}
                withoutSuffix
                withoutTimeTruncate
              />
            </q>{' '}
            remaining
          </li>
        </>
      )
      // otherwise the karaoke is finished
    } else {
      end = <li>Karaoke ended</li>
    }
    // both playlist date end and karaoke date stop
  } else if (playlistHasDateEnd && karaokeHasDateStop) {
    // karaoke date stop is after playlist date end
    if (dayjs(playlistDateEnd).isBefore(karaokeDateStop)) {
      end = (
        <>
          <li>
            Karaoke ends at{' '}
            <q>
              <Time iso={karaokeDateStop} />
            </q>
          </li>
          <li>
            <q>
              <TimeRelative
                iso={karaokeDateStop}
                relativeToIso={playlistDateEnd}
                withoutSuffix
                withoutTimeTruncate
              />
            </q>{' '}
            remaining in playlist
          </li>
        </>
      )
      // playlist date end is after karaoke date stop
    } else {
      end = (
        <>
          <li>
            Playlist should end after karaoke at{' '}
            <q>
              <Time iso={playlistDateEnd} />
            </q>
          </li>
          <li>Playlist exceeds karaoke scheduled end!</li>
        </>
      )
    }
  }

  return (
    <CarouselEntry jumbo="Playlist" className="stats">
      <ul>
        {playedStats}
        {queuingStats}
        {end}
      </ul>
    </CarouselEntry>
  )
}
