import PropTypes from 'prop-types'
import { Component } from 'react'
import Highlighter from 'react-highlight-words'

/**
 * HighlighterQuery compnent
 *
 * This component facilitates the highlighting of terms associated to a query. If
 * the query is present, a classic `Highlighter` component is rendered, otherwise
 * a `span` is rendered. The component has the same props as `Highlighter`,
 * except:
 *    query <object>: dictionary of query terms. If not defined, a `span` is
 *        rendered.
 *    className <string>: CSS class applied to the `Highlighter` and the `span`.
 *    searchWords <array/function>: if provided as an array, it has the same
 *        behavior as in `Highlighter`. If provided as a fanction, it takes the
 *        query as argument and must return an array, which is passed to
 *        `Highlighter`.
 *
 * The `Highlighter` component is used with the `autoEscape` props activated.
 */
export default class HighlighterQuery extends Component {
  static propTypes = {
    className: PropTypes.string,
    query: PropTypes.object,
    searchWords: PropTypes.oneOfType([PropTypes.func, PropTypes.array])
      .isRequired,
    textToHighlight: PropTypes.string.isRequired,
    children: PropTypes.node,
  }

  render() {
    const {
      query,
      className,
      children,
      searchWords,
      textToHighlight,
      ...remaining
    } = this.props

    // render a classic `span` if no query
    if (!query) return <span className={className}>{textToHighlight}</span>

    // if `searchWords` is a function, call it with the query
    let searchWordsArray
    if (typeof searchWords === 'function') {
      searchWordsArray = searchWords(query)
    } else {
      searchWordsArray = searchWords
    }

    return (
      <Highlighter
        className={className}
        searchWords={searchWordsArray}
        textToHighlight={textToHighlight}
        autoEscape
        {...remaining}
      />
    )
  }
}
