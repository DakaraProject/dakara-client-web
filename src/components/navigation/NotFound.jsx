import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router'

export default function NotFound({ embedded }) {
  const location = useLocation()

  const url = location.pathname
  return (
    <div id="error-page" className={classNames('box danger', { embedded })}>
      <div className="header">
        <h2>Not found</h2>
      </div>
      <div className="flow">
        <div className="url">{url}</div>
        <p>We&apos;re sorry, your request did not match any route…</p>
      </div>
    </div>
  )
}

NotFound.propTypes = {
  embedded: PropTypes.bool,
}
