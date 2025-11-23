import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'

import { storeSearchBox } from 'actions/library'
import { CSSTransitionLazy } from 'thirdpartyExtensions/ReactTransitionGroup'

export default function SearchBox({ help, placeholder }) {
  const searchBox = useSelector((state) => state.library.searchBox)

  const [displayHelp, setDisplayHelp] = useState(false)
  const [query, setQuery] = useState('')
  const queryRef = useRef()

  const [searchParams, setSearchParams] = useSearchParams()

  const dispatch = useDispatch()

  const queryStore = searchBox.query
  const queryParams = searchParams.get('query')

  useEffect(() => {
    queryRef.current = query
  }, [query])

  useEffect(
    () => {
      // update query from store immediately
      if (queryStore !== null) {
        setQuery(queryStore)
        queryRef.current = queryStore
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(
    () => {
      // update query from URL immediately
      if (queryParams !== null) {
        setQuery(queryParams)
        queryRef.current = queryParams
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(
    () => () => {
      // update store when component unmounts
      if (queryRef.current !== null) {
        dispatch(storeSearchBox({ query: queryRef.current }))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // help message
  let helpButton
  let helpBox
  if (help) {
    helpButton = (
      <button
        className="control square transparent"
        type="button"
        onClick={() => {
          setDisplayHelp(!displayHelp)
        }}
      >
        <span className="icon">
          <i className="las la-question-circle"></i>
        </span>
      </button>
    )

    helpBox = (
      <CSSTransitionLazy
        in={displayHelp}
        classNames="help"
        timeout={{
          enter: 300,
          exit: 150,
        }}
      >
        <div className="help">{help}</div>
      </CSSTransitionLazy>
    )
  }

  return (
    <div className="searchbox primary flow">
      <form
        className="form inline"
        onSubmit={(e) => {
          e.preventDefault()
          setSearchParams({ query })
        }}
      >
        <div className="set">
          <div className="field">
            <div className="text-input input fake" id="library-searchbox-fake">
              <input
                className="faked"
                placeholder={placeholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                }}
                onFocus={() => {
                  document
                    .getElementById('library-searchbox-fake')
                    .classList.add('focus')
                }}
                onBlur={() => {
                  document
                    .getElementById('library-searchbox-fake')
                    .classList.remove('focus')
                }}
              />
              <div className="controls compact">
                {helpButton}
                <button
                  className="control square transparent"
                  type="button"
                  onClick={() => {
                    setQuery('')
                    // clear query string
                    // this.props.setSearchParams({})
                  }}
                >
                  <span className="icon">
                    <i className="las la-times"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="controls">
          <button type="submit" className="control square primary">
            <span className="icon">
              <i className="las la-search"></i>
            </span>
          </button>
        </div>
      </form>
      {helpBox}
    </div>
  )
}

SearchBox.propTypes = {
  help: PropTypes.element,
  placeholder: PropTypes.string.isRequired,
}
