import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

/**
 * Reduceable component
 *
 * This component adds a class to its child when a the user has scrolled passed a
 * certain given thresold. The thresold can be unique, or double, one for ascending
 * and the other for descending scroll.
 */
export class Reduceable extends Component {
    static propTypes = {
        thresold: PropTypes.oneOfType([
            PropTypes.number.isRequired,
            PropTypes.shape({
                up: PropTypes.number.isRequired,
                down: PropTypes.number.isRequired
            })
        ]),
        classNameOnThresold: PropTypes.string
    }

    state = {
        isReduced: false,
        latestPosition: 0,
        thresoldUp: 0,
        thresoldDown: 0,
    }

    static defaultProps = {
        thresold: 0,
        classNameOnThresold: 'reduced',
    }

    componentDidMount() {
        // set up thresolds
        const { thresold } = this.props
        if (typeof thresold === 'object') {
            const { up, down } = thresold
            this.setState({
                thresoldUp: up,
                thresoldDown: down
            })
        } else {
            this.setState({
                thresoldUp: thresold,
                thresoldDown: thresold
            })
        }

        // add scroll event listener
        window.addEventListener('scroll', this.onScroll, false)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll, false)
    }

    onScroll = (e) => {
        const { isReduced, thresoldUp, thresoldDown, latestPosition } = this.state
        const currentPosition = window.pageYOffset

        // save position
        this.setState({latestPosition: currentPosition})

        // direction of scroll
        const deltaPosition = currentPosition - latestPosition

        // we descend beneath the up thresold
        if (currentPosition > thresoldUp && deltaPosition > 0) {
            if (!isReduced) this.setState({isReduced: true})

            return
        }

        // if we ascend above the down thresold
        if (currentPosition < thresoldDown && deltaPosition < 0) {
            if (isReduced) this.setState({isReduced: false})

            return
        }
    }

    render() {
        const { isReduced } = this.state
        const { children, classNameOnThresold, addComponent } = this.props

        if (React.Children.count(children) > 1) {
            throw new Error("Reduceable can contain one child only")
        }

        if (!isReduced) return children

        if (!addComponent) {
            const childrenNew = React.cloneElement(
                children,
                {className: classNames(children.props.className, classNameOnThresold)}
            )

            return childrenNew
        }

        return (
            <div className={classNameOnThresold}>
                {children}
            </div>
        )
    }
}
