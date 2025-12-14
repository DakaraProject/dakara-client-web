import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useOutletContext, useParams, useSearchParams } from 'react-router'

import { loadLibraryEntries } from 'actions/library'
import ListingList from 'components/generics/listing/List'
import Navigator from 'components/generics/Navigator'
import SearchBox from 'components/generics/SearchBox'
import WorkEntry from 'components/library/work/Entry'
import NotFound from 'components/navigation/NotFound'
import { Status } from 'reducers/alterationsResponse'

export default function WorkList() {
  const params = useParams()
  const { workType: workTypeQueryName } = params

  const workState = useSelector(
    (state) => state.library.works[workTypeQueryName]
  )
  const workTypeState = useSelector((state) => state.library.workType)

  const dispatch = useDispatch()

  const [searchBoxQuery, setSearchBoxQuery] = useOutletContext()

  const [searchParams, _] = useSearchParams()

  const { page, query } = Object.fromEntries(searchParams.entries())
  const { status: workTypeStatus } = workTypeState

  // check if work types are fetched
  const isReady = useCallback(
    () => workTypeStatus === Status.successful,
    [workTypeStatus]
  )

  useEffect(
    () => {
      // do not load if not ready
      if (!isReady()) {
        return
      }

      // load entries if the page, the query, the work type, or the work thype status changes
      dispatch(
        loadLibraryEntries('works', {
          page,
          query,
          type: workTypeQueryName,
        })
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, query, workTypeQueryName, workTypeStatus]
  )

  // do not render anything if not ready
  if (!isReady()) {
    return null
  }

  const workType = workTypeState.data.workTypes.find(
    (workType) => workType.query_name === workTypeQueryName
  )

  // check work type is valid
  if (!workType) {
    return <NotFound embedded />
  }

  const { works, query: queryParsed, count, pagination } = workState.data

  // create the WorkEntry for each work
  const libraryEntryWorkList = works.map((work) => (
    <WorkEntry
      key={work.id}
      work={work}
      workType={workTypeQueryName}
      query={queryParsed}
    />
  ))

  return (
    <div id="work-library">
      <SearchBox
        placeholder={`What ${workType.name.toLowerCase()} do you want?`}
        query={searchBoxQuery}
        setQuery={setSearchBoxQuery}
        help={{
          example: workType.name.toLowerCase(),
        }}
      />
      <ListingList fetchStatus={workState.status} noTransition>
        {libraryEntryWorkList}
      </ListingList>
      <Navigator
        count={count}
        pagination={pagination}
        names={{
          singular: workType.name.toLowerCase(),
          plural: workType.name_plural.toLowerCase(),
        }}
      />
    </div>
  )
}
