import { useLocation } from 'react-router'

export default function Forbidden() {
  const location = useLocation()

  const url = location.pathname
  return (
    <div id="error-page" className="box danger">
      <div className="header">
        <h2>Forbidden</h2>
      </div>
      <div className="flow">
        <div className="url">{url}</div>
        <p>
          We&apos;re sorry, you do not have the privilege to access this
          ressource.
        </p>
      </div>
    </div>
  )
}
