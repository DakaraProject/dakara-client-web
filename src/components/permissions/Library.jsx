import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { mapStateToProps, PermissionBase } from 'components/permissions/Base'

/**
 * Library manager
 */

export const IsLibraryManager = withRouter(connect(
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
))
