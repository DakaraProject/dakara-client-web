import React, { Component } from 'react'
import classNames from 'classnames'

export class Reduceable extends Component {
    state = {
        isReduced: false,
    }

    static defaultProps = {
        thresold: 0,
        classNameOnThresold: 'reduced',
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll, false)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll, false)
    }

    onScroll = (e) => {
        const { isReduced } = this.state
        const { thresold } = this.props

        if (window.pageYOffset > thresold) {
            if (!isReduced) this.setState({isReduced: true})
        } else {
            this.setState({isReduced: false})
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
