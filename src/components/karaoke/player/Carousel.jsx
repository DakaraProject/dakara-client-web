import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import queryString from 'query-string'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

import { CarouselEntry } from 'components/generics/Carousel'
import PlaylistEntryWidget from 'components/playlist/widgets/PlaylistEntry'
import { formatDate, formatDuration } from 'utils'

dayjs.extend(relativeTime)

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
      <div className="timing">
        <div className="current">{formatDuration(timing)}</div>
        <div className="duration">{formatDuration(entry.song.duration)}</div>
      </div>
    </CarouselEntry>
  )
}

export function CarouselEntryNextSong() {
  const { playlistEntries } = useSelector(
    (state) => state.playlist.digest.entries.data
  )
  const entry = playlistEntries.find((e) => e.will_play)

  if (!entry) {
    return null
  }

  return (
    <CarouselEntry jumbo="Next" className="next-song">
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
        <PlaylistEntryWidget entry={entry} truncatable />
      </Link>
    </CarouselEntry>
  )
}

export function CarouselEntryStats() {
  const { playlistEntries, dateEnd } = useSelector(
    (state) => state.playlist.digest.entries.data
  )
  const { data: playerStatus } = useSelector(
    (state) => state.playlist.playerStatus
  )
  const { date_stop: karaokeDateStop } = useSelector(
    (state) => state.playlist.karaoke.data
  )
  const countPlayed = playlistEntries.filter((e) => e.was_played).length
  const countQueueing = playlistEntries.filter((e) => e.will_play).length

  /**
   * Played songs
   */

  let played
  switch (countPlayed) {
    case 0:
      played = <li>The karaoke has just started!</li>
      break
    case 1:
      played = <li>One song played, keep going!</li>
      break
    default:
      played = (
        <li>
          <q>{countPlayed}</q> songs played so far
        </li>
      )
  }

  /**
   * Queuing songs
   */

  let queuing
  switch (countQueueing) {
    case 0:
      queuing = <li>No songs queued in playlist yet</li>
      break
    case 1:
      queuing = <li>One song queued in playlist, add more!</li>
      break
    default:
      queuing = (
        <li>
          <q>{countQueueing}</q> songs queued in playlist
        </li>
      )
  }

  /**
   * Display karaoke end or playlist end
   *
   * The code is voluntary redundant, as the different cases do not factor
   * well together. At least, the code is easy to understand.
   */

  const playlistEndDate =
    dateEnd && (countQueueing || playerStatus.playlist_entry)
      ? dayjs(dateEnd)
      : null
  const karaokeEndDate = karaokeDateStop ? dayjs(karaokeDateStop) : null

  let end
  // only playlist date end
  if (playlistEndDate && !karaokeEndDate) {
    end = (
      <li>
        Playlist ends at <q>{formatDate(playlistEndDate)}</q>
      </li>
    )
    // only karaoke date end
  } else if (!playlistEndDate && karaokeEndDate) {
    if (karaokeEndDate.isAfter()) {
      end = (
        <>
          <li>
            Karaoke ends at <q>{formatDate(karaokeEndDate)}</q>
          </li>
          <li>
            <q>{dayjs().to(karaokeEndDate, true)}</q> remaining
          </li>
        </>
      )
    } else {
      end = <li>Karaoke ended</li>
    }
    // both playlist date end and karaoke date end
  } else if (playlistEndDate && karaokeEndDate) {
    // karaoke date end is after playlist date end
    if (karaokeEndDate.isAfter(playlistEndDate)) {
      end = (
        <>
          <li>
            Karaoke ends at <q>{formatDate(karaokeEndDate)}</q>
          </li>
          <li>
            <q>{dayjs().to(karaokeEndDate, true)}</q> remaining
          </li>
        </>
      )
      // playlist date end is after karaoke date end
    } else {
      end = (
        <>
          <li>
            Playlist should end after karaoke at{' '}
            <q>{formatDate(playlistEndDate)}</q>
          </li>
          <li>Playlist exceeds karaoke scheduled end!</li>
        </>
      )
    }
  }

  return (
    <CarouselEntry jumbo="Playlist" className="stats">
      <ul>
        {played}
        {queuing}
        {end}
      </ul>
    </CarouselEntry>
  )
}
