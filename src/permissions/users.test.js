import { describe, expect, test } from 'vitest'

import { isNotSelf, isUserManager } from './users'

describe('is users manager', () => {
  test('null user', () => {
    expect(isUserManager(null)).toBeFalsy()
  })

  test('non null user', () => {
    expect(isUserManager({})).toBeFalsy()
  })

  test('super user', () => {
    expect(isUserManager({ is_superuser: true })).toBeTruthy()
  })

  test('library manager', () => {
    expect(isUserManager({ users_permission_level: 'm' })).toBeTruthy()
  })
})

describe('is not self', () => {
  test('null user', () => {
    expect(isNotSelf(null, null)).toBeFalsy()
  })

  test('non null user', () => {
    expect(isNotSelf({}, null)).toBeFalsy()
  })

  test('super user', () => {
    expect(isNotSelf({ is_superuser: true }, null)).toBeTruthy()
  })

  test('not self', () => {
    expect(isNotSelf({ id: 1 }, { id: 2 })).toBeTruthy()
  })

  test('self', () => {
    expect(isNotSelf({ id: 1 }, { id: 1 })).toBeFalsy()
  })
})
