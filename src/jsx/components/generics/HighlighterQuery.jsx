import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highlighter from 'react-highlight-words'

export default class HighlighterQuery extends Component {
    static propTypes = {
        query: PropTypes.object,
        className: PropTypes.string,
        searchWords: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.array,
        ]).isRequired,
        textToHighlight: PropTypes.string.isRequired,
    }

    render() {
        const { query, className, children, searchWords, textToHighlight,
            ...remaining } = this.props

        if (!query) return (
            <span className={className}>
                {textToHighlight}
            </span>
        )

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
