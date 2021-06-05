import React from 'react'
import { Link } from 'react-router-dom'

export default () => (
    <div className="box" id="kara-status-notification">
        <div className="message">
            The karaoke is stopped for now. You can activate
            it in the settings page.
        </div>
        <div className="controls">
            <Link
                className="control primary"
                to="/settings/kara-status"
            >
                Go to settings page
            </Link>
        </div>
    </div>
)
