import { Link } from 'react-router-dom'

const karaStatusNotification = () => (
    <div className="box" id="kara-status-notification">
        <div className="content">
            <div className="ribbon primary">
                <p className="message">
                    The karaoke is stopped for now.
                    You can activate it in the settings page.
                </p>
                <div className="controls free">
                    <Link
                        className="control primary"
                        to="/settings/kara-status"
                    >
                        Go to settings page
                    </Link>
                </div>
            </div>
        </div>
    </div>
)

export default karaStatusNotification
