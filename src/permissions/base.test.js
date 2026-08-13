import { describe, expect, test } from 'vitest'

import { isAuthenticated, isSuperUser } from './base'

describe('is authenticated', () => {
  test('null user', () => {
    expect(isAuthenticated(null)).toBeFalsy()
  })

  test('non null user', () => {
    expect(isAuthenticated({})).toBeTruthy()
  })
})

describe('is super user', () => {
  test('null user', () => {
    expect(isSuperUser(null)).toBeFalsy()
  })

  test('non null user', () => {
    expect(isSuperUser({})).toBeFalsy()
  })

  test('super user', () => {
    expect(isSuperUser({ is_superuser: true })).toBeTruthy()
  })
})
