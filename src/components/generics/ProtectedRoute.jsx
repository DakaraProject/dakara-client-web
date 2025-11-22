import PropTypes from 'prop-types'
import queryString from 'query-string'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router'

/**
 * Add desired page to query string
 */
function createQueryFrom(location) {
  const { pathname, search } = location

  // if pathname is the root page, ignore it
  let actualPathname = ''
  if (pathname !== '/') {
    actualPathname = pathname
  }

  // if desired page is the root page, ignore it
  const query = actualPathname + search
  if (query.length === 0) {
    return {}
  }

  return {
    from: actualPathname + search,
  }
}

export default function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector((state) => !!state.token)
  const hasUserInfo = useSelector((state) => !!state.authenticatedUser)
  const location = useLocation()

  if (!isLoggedIn) {
    // if not logged, redirect to login page
    return (
      <Navigate
        to={{
          pathname: '/login',
          search: queryString.stringify(createQueryFrom(location)),
        }}
        replace
      />
    )
  }

  if (!hasUserInfo) {
    // if no logging info can be obtained, render nothing
    return null
  }

  return children ? children : <Outlet />
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
}
