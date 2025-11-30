import { describe, expect, test } from 'vitest'

import { isLibraryManager } from './library'

describe('is library manager', () => {
  test('null user', () => {
    expect(isLibraryManager(null)).toBeFalsy()
  })

  test('non null user', () => {
    expect(isLibraryManager({})).toBeFalsy()
  })

  test('super user', () => {
    expect(isLibraryManager({ is_superuser: true })).toBeTruthy()
  })

  test('library manager', () => {
    expect(isLibraryManager({ library_permission_level: 'm' })).toBeTruthy()
  })
})
