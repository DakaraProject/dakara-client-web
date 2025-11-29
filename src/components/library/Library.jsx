import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router'

import { loadWorkTypes, storeSearchBox } from 'actions/library'
import { Tab, TabBar } from 'components/generics/TabBar'
import { Status } from 'reducers/alterationsResponse'

export default function Library() {
  const workTypeState = useSelector((state) => state.library.workType)

  const dispatch = useDispatch()

  useEffect(
    () => {
      // load work types on mount
      dispatch(loadWorkTypes())

      // reseat library search box
      return () => {
        dispatch(storeSearchBox({ query: '' }))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // work types links
  let workTypesTabs
  if (workTypeState.status === Status.successful) {
    workTypesTabs = workTypeState.data.workTypes.map((workType) => (
      <Tab
        key={workType.query_name}
        to={`/library/${workType.query_name}`}
        iconName={workType.icon_name}
        name={workType.name_plural}
      />
    ))
  }

  return (
    <div id="library" className="box neutral">
      <TabBar>
        <Tab to="/library/song" iconName="music" extraClassName="home" />
        <Tab to="/library/artist" iconName="microphone-alt" name="Artists" />
        {workTypesTabs}
      </TabBar>
      <Outlet />
    </div>
  )
}
