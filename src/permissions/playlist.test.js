import { describe, expect, test } from 'vitest'

import {
  canAddToPlaylist,
  isPlaylistManager,
  isPlaylistManagerOrOwner,
  isPlaylistUser,
} from './playlist'

describe('is playlist manager', () => {
  test('null user', () => {
    expect(isPlaylistManager(null)).toBeFalsy()
  })

  test('non null user', () => {
    expect(isPlaylistManager({})).toBeFalsy()
  })

  test('super user', () => {
    expect(isPlaylistManager({ is_superuser: true })).toBeTruthy()
  })

  test('library manager', () => {
    expect(isPlaylistManager({ playlist_permission_level: 'm' })).toBeTruthy()
  })
})

describe('is playlist manager or owner', () => {
  test('null user', () => {
    expect(isPlaylistManagerOrOwner(null, null)).toBeFalsy()
  })

  test('super user', () => {
    expect(isPlaylistManagerOrOwner({ is_superuser: true }, null)).toBeTruthy()
  })

  test('library manager', () => {
    expect(
      isPlaylistManagerOrOwner({ playlist_permission_level: 'm' }, null)
    ).toBeTruthy()
  })

  test('no object', () => {
    expect(isPlaylistManagerOrOwner({}, null)).toBeFalsy()
  })

  test('not own object', () => {
    expect(
      isPlaylistManagerOrOwner({ id: 1 }, { owner: { id: 2 } })
    ).toBeFalsy()
  })

  test('own object', () => {
    expect(
      isPlaylistManagerOrOwner({ id: 1 }, { owner: { id: 1 } })
    ).toBeTruthy()
  })
})

describe('is playlist user', () => {
  test('null user', () => {
    expect(isPlaylistUser(null)).toBeFalsy()
  })

  test('non null user', () => {
    expect(isPlaylistUser({})).toBeFalsy()
  })

  test('super user', () => {
    expect(isPlaylistUser({ is_superuser: true })).toBeTruthy()
  })

  test('library manager', () => {
    expect(isPlaylistUser({ playlist_permission_level: 'm' })).toBeTruthy()
  })

  test('library user', () => {
    expect(isPlaylistUser({ playlist_permission_level: 'u' })).toBeTruthy()
  })
})

describe('can add to playlist', () => {
  test('karaoke not ongoing', () => {
    expect(canAddToPlaylist(null, { ongoing: false })).toBeFalsy()
  })

  test('null user', () => {
    expect(canAddToPlaylist(null, { ongoing: true })).toBeFalsy()
  })

  test('super user', () => {
    expect(
      canAddToPlaylist({ is_superuser: true }, { ongoing: true })
    ).toBeTruthy()
  })

  test('library manager', () => {
    expect(
      canAddToPlaylist({ playlist_permission_level: 'm' }, { ongoing: true })
    ).toBeTruthy()
  })

  test('karaoke cannot add to playlist', () => {
    expect(
      canAddToPlaylist({}, { ongoing: true, can_add_to_playlist: false })
    ).toBeFalsy()
  })

  test('non null user', () => {
    expect(
      canAddToPlaylist({}, { ongoing: true, can_add_to_playlist: true })
    ).toBeFalsy()
  })

  test('library user', () => {
    expect(
      canAddToPlaylist(
        { playlist_permission_level: 'u' },
        { ongoing: true, can_add_to_playlist: true }
      )
    ).toBeTruthy()
  })
})
