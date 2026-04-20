import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router'

import { useDefaultTransitionState } from 'hooks/transitions'

function SearchBoxHelp({ example, fields, withHash }) {
  return (
    <div className="help">
      <p>You can obtain better results with the query search mini-language:</p>
      <ul>
        <li>
          Quotes to group words: <q>&quot;my {example}&quot;</q>
        </li>
        {fields && (
          <>
            <li>
              Prefix and quotes to search in a specific field:{' '}
              <q>
                {example}:&quot;my {example}&quot;
              </q>
            </li>
            <li>
              Prefix and doubled quotes to search a specific field exactly:{' '}
              <q>
                {example}:&quot;&quot;my {example} exact&quot;&quot;
              </q>
            </li>
            <li>
              List of accepted fields: <q>{fields}</q>
            </li>
          </>
        )}
        {withHash && (
          <li>
            Hash tag to target tags: <q>#tag</q>
          </li>
        )}
      </ul>
    </div>
  )
}

SearchBoxHelp.propTypes = {
  example: PropTypes.string.isRequired,
  fields: PropTypes.string,
  withHash: PropTypes.bool,
}

/**
 * Search box
 *
 * Note that the query and its setter are owned by a parent component.
 */
export default function SearchBox({ help, placeholder, query, setQuery }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const queryFromParams = searchParams.get('query')

  const [transitionState, transitionToggle] = useDefaultTransitionState()

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
          transitionToggle()
        }}
      >
        <span className="icon">
          <i className="las la-question-circle"></i>
        </span>
      </button>
    )

    if (transitionState.isMounted) {
      helpBox = (
        <div className={`help ${transitionState.status}`}>
          <SearchBoxHelp {...help} />
        </div>
      )
    }
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
  help: PropTypes.shape(SearchBoxHelp.propTypes),
  placeholder: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
}
