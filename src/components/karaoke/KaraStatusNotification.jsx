import { Link } from 'react-router'

export default function KaraStatusNotification() {
  return (
    <div className="box primary" id="kara-status-notification">
      <div className="content">
        <p className="message">
          The karaoke is stopped for now. You can activate it in the settings
          page.
        </p>
        <div className="controls">
          <Link className="control primary" to="/settings/kara-status">
            Go to settings page
          </Link>
        </div>
      </div>
    </div>
  )
}
