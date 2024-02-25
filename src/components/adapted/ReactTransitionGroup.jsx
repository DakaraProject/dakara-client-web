import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'

/**
 * The CSSTransitionLazy component is a sanitized version of CSSTransition
 *
 * It is aimed to fix its dysfunctionnal behavior related in
 * https://github.com/reactjs/react-transition-group/issues/156
 * The problem is that the child component is always visible, either before the
 * enter transition starts or after the exit transition finishes. The solution
 * is to force the mounting of the children component only when the enter
 * transition is bound to start and its unmounting when the exit transition has
 * finished, hence resulting in a "lazy" mounting.
 *
 * The problem is present in the example of the OFFICIAL DOCUMENTATION, which
 * makes it plainly NOT WORKING. This demonstrates how STUPID devoloppers are in
 * the FUCKING JS COMMUNITY.
 */

export const CSSTransitionLazy = ({children, ...props}) => (
    <CSSTransition
        mountOnEnter
        unmountOnExit
        {...props}
    >
        {children}
    </CSSTransition>
)
CSSTransitionLazy.propTypes = {
    children: PropTypes.node,
}
