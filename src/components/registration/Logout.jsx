import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router'

import { logout } from 'actions/token'

export default function Logout() {
  const dispatch = useDispatch()

  useEffect(
    () => {
      // logout immediately
      dispatch(logout())
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return <Navigate to="/login" />
}
