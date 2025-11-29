import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { CSSTransitionLazy } from 'thirdpartyExtensions/ReactTransitionGroup'

/**
 * Search box
 *
 * Note that the query and its setter are owned by a parent component.
 */
export default function SearchBox({ help, placeholder, query, setQuery }) {
  const [displayHelp, setDisplayHelp] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const queryFromParams = searchParams.get('query')

  useEffect(
    () => {
      // update query from URL immediately
      if (queryFromParams !== null) {
        setQuery(queryFromParams)
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
                    setSearchParams({})
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
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
}
