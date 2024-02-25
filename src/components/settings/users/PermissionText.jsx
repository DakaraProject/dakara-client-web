import PropTypes from 'prop-types'

import { permissionLevels } from 'utils/permissions';

export default function PermissionText({ level }) {
    if (!level) {
        return null
    }

    const permissionText = permissionLevels[level]

    return (
        <span className="permission-text">
            {permissionText.substring(0, 1)}
            <span className="hideable">
                {permissionText.substring(1)}
            </span>
        </span>
    )
}
PermissionText.propTypes = {
    level: PropTypes.string
}
