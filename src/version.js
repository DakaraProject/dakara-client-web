import semver from 'semver'

const version = semver.parse(import.meta.env.DAKARA_VERSION)

export default version
