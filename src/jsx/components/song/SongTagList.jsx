import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { songTagPropType } from 'serverPropTypes/library'

export default class SongTagList extends Component {
    static propTypes = {
        tags: PropTypes.arrayOf(songTagPropType).isRequired,
        setQuery: PropTypes.func,
        query: PropTypes.object,
        unclickable: PropTypes.bool,
    }

    render() {
        const songTagClassArray = ['tag']

        /**
         * Display Tags
         * display as cliquable tags if a setQuery prop is passed
         */

        const { tags, setQuery, query } = this.props
        let searchIcon
        if (setQuery) {
            // Set clickable and add search icon
            songTagClassArray.push('clickable')
            searchIcon = (
                <span className="icon">
                    <i className="fa fa-search"></i>
                </span>
            )
        }

        const tagList = tags.map( tag => {
            // Grey out tag when searching a tag other than this
            songTagClassArray.push({
                'disabled': query && query.tag.length && query.tag.indexOf(tag.name) == -1
            })

            if (this.props.unclickable) {
                return (
                    <div
                        className={classNames(songTagClassArray)}
                        style={{filter: `hue-rotate(${tag.color_hue}deg)`}}
                        key={tag.name}
                    >
                        {searchIcon}
                        {tag.name}
                    </div>
                )
            }

            return (
                <button
                    className={classNames(songTagClassArray)}
                    style={{filter: `hue-rotate(${tag.color_hue}deg)`}}
                    key={tag.name}
                    onClick={() => setQuery && setQuery(`#${tag.name}`)}
                >
                    {searchIcon}
                    {tag.name}
                </button>
            )
        })

        return (
                <div className="song-tag-list">
                    {tagList}
                </div>
        )
    }
}
