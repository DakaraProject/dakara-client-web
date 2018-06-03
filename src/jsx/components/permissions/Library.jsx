import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { PermissionBase, mapStateToProps } from './Base'

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
            return user.library_permission_level == 'm'
        }
    }
))
