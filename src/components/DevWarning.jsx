import version from 'version'

export default function DevWarning() {
  if (version.prerelease.length > 0) {
    console.log('You are running a dev version, use it at your own risks!')
    return (
      <div id="dev-warning" className="warning">
        You are running a dev version, use it at your own risks!
      </div>
    )
  }

  return null
}
