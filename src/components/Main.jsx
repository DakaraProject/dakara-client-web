import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { loadCurrentUser } from 'actions/authenticatedUser'
import { loadServerSettings } from 'actions/internal'
import { loadWorkTypes } from 'actions/library'
import DevWarning from 'components/DevWarning'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Karaoke from 'components/karaoke/Karaoke'
import { IsAuthenticated } from 'permissions/Base'

export default function Main({ children }) {
  const isLoggedIn = useSelector((state) => !!state.token)

  const dispatch = useDispatch()

  useEffect(
    () => {
      // load server settings immediately
      dispatch(loadServerSettings())
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(
    () => {
      // load current user immediately and if the logging status changes
      if (isLoggedIn) {
        dispatch(loadCurrentUser())
        dispatch(loadWorkTypes())
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoggedIn]
  )

  return (
    <div id="main">
      <DevWarning />
      <div className="column">
        <Header />
        <IsAuthenticated>
          <Karaoke />
        </IsAuthenticated>
        {children}
        <Footer />
      </div>
    </div>
  )
}

Main.propTypes = {
  children: PropTypes.node,
}
