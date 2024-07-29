import { connect } from 'react-redux'

import { PermissionBase } from 'components/permissions/Base'
import { mapStateToProps } from 'utils/permissions'

/**
 * Library manager
 */

export const IsLibraryManager = connect(
    mapStateToProps
)(
    class extends PermissionBase {
        static propTypes = {
            ...PermissionBase.propTypes,
        }

        static hasPermissionCustom(user) {
            return user.library_permission_level === 'm'
        }
    }
)
