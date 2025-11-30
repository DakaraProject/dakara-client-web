export function isDeterminated(outcome) {
  return outcome !== undefined
}

export function determineToTrue(outcome) {
  if (outcome === undefined) {
    return true
  }

  return outcome
}

export function determineToFalse(outcome) {
  if (outcome === undefined) {
    return false
  }

  return outcome
}
