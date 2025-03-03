import { PermissionBase } from 'permissions/Base'
import { connect } from 'react-redux'

import { userPropType } from 'serverPropTypes/users'
import { mapStateToProps } from 'utils/permissions'

/**
 * Users manager
 */

export const IsUserManager = connect(
    mapStateToProps
)(
    class extends PermissionBase {
        static hasPermissionCustom(user) {
            return (user.users_permission_level === 'm')
        }
    }
)

/**
 * Not self
 */

export const IsNotSelf = connect(
    mapStateToProps
)(
    class extends PermissionBase {
        static propTypes = {
            ...PermissionBase.propTypes,
            object: userPropType.isRequired,
        }

        static hasPermissionCustom(user, object) {
            return (user.id !== object.id)
        }
    }
)
