import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import { Status, alterationResponsePropType } from 'reducers/alterationsResponse'

/**
 * ManageButton class for a button connected to a player manage command
 *
 * This button plays a transition when the status of the manage command changes.
 * The icon exit the button and re-enters. The button is somewhat protected during
 * the exit transition, since the new status (or new icon) will be taken into
 * account at the end of the exit transition, to be sure the icon exits
 * gracefully. This is done by using the state of the component.
 *
 * - statusManage: when the status is pending, the button is in transition and
 *      won't take account of the status untill the exit transition ends.
 * - icon: icon to display on the button. If the icon changes, it will be taken
 *      into account immediately if there is no transition or when the exit
 *      transition ends.
 * - disabled: disabled boolean.
 * - iconDisabled: if disabled, the button use this icon if provided. Otherwise
 *      use the normal one.
 * - className: extra class to pass to the button.
 * - timeout: duration of the transition. Default to 150 ms.
 * - onClick: handle to pass to the button.
 */
export default class ManageButton extends Component {
    static propTypes = {
        statusManage: alterationResponsePropType.isRequired,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        timeout: PropTypes.number,
        onClick: PropTypes.func.isRequired,
        icon: PropTypes.string.isRequired,
        iconDisabled: PropTypes.string,
    }

    static defaultProps = {
        timeout: 150,
    }

    state = {
        isLeaving: false,
        display: true,
        error: false,
        icon: '',
    }

    componentDidUpdate(prevProps) {
        // do not watch for udptates during the transition
        if (this.state.isLeaving) return

        const status = this.props.statusManage.status
        const prevStatus = prevProps.statusManage.status

        if (status !== prevStatus) {
            if (status === Status.pending) {
                // the status being pending means that the transition starts
                this.setState({
                    isLeaving: true,
                    display: false,
                    error: false,
                })

                // udpate the state after the transition duration
                // we can't directly use the CSSTransition `onExit` and
                // `onExited` attributes, because this leads to modify the state
                // within the render and is anti-pattern
                this.transitionEndedTimeout = setTimeout(
                    this.transitionEndedFunc,
                    this.props.timeout
                )
            } else {
                // if the request took more time than the timeout, the display is
                // reactivated when ready
                this.setState({
                    display: true,
                    error: status === Status.failed,
                })
            }
        }

        const icon = this.props.icon
        const prevIcon = prevProps.icon

        if (icon !== prevIcon) {
            // if the icon has changed (not during the transition), update it
            this.setState({icon})
        }
    }

    transitionEndedFunc = () => {
        // this callback unsets the transition state and sets the display to its
        // current state
        // if the request has not finished, the display is reset in
        // `componentDidUpdate`
        const { statusManage, icon } = this.props
        this.setState({
            isLeaving: false,
            display: statusManage.status !== Status.pending,
            error: statusManage.status === Status.failed,
            icon,
        })
    }

    componentWillUnmount() {
        // clear the state update
        clearTimeout(self.transitionEndedTimeout)
    }

    componentWillMount() {
        // set the first icon
        const { icon } = this.props
        this.setState({icon})
    }

    render() {
        const { onClick, disabled, className, timeout, iconDisabled } = this.props

        const onClickControlled = (e) => {
            // do not manage any other click during the transition
            // since there is a delay between the click and the update of the
            // state, one can click the button more than once…
            if (this.state.isLeaving) return
            onClick(e)
        }

        // if the button is disabled, use the disabled icon
        // if there is no disabled icon, use the normal one
        // use the normal one if the button is not disabled as well
        const icon = disabled ?
            iconDisabled || this.state.icon :
            this.state.icon

        return (
            <button
                className={classNames(
                    'control',
                    'primary',
                    className,
                    {'managed-error': this.state.error},
                )}
                onClick={onClickControlled}
                disabled={disabled}
            >
                <CSSTransitionLazy
                    in={this.state.display}
                    classNames="managed"
                    timeout={timeout}
                >
                    <span className="managed icon">
                        <i className={`fa fa-${icon}`}></i>
                    </span>
                </CSSTransitionLazy>
            </button>
        )
    }
}
