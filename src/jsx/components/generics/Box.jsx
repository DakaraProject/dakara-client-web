import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

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
        const deltaPosition = currentPosition - latestPosition

        if (currentPosition > thresoldUp && deltaPosition > 0) {
            if (!isReduced) this.setState({isReduced: true})
        } else if (currentPosition < thresoldDown && deltaPosition < 0) {
            if (isReduced) this.setState({isReduced: false})
        }

        this.setState({latestPosition: currentPosition})
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
