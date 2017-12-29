import React, { Component } from 'react'

export default class SongTagList extends Component {
    render() {
        /**
         * Display Tags
         * display as cliquable tags if a setQuery prop is passed
         */

        const { tags, setQuery, query } = this.props
        let classClickable = ""
        let searchIcon
        if (setQuery) {
            // Set clickable and add search icon
            classClickable = " clickable"
            searchIcon = (
                <span className="icon">
                    <i className="fa fa-search"></i>
                </span>
            )
        }

        const tagList = tags.map( tag => {
            // Grey out tag when searching a tag other than this
            let classDisabled = ""
            if (query && query.tag.length && query.tag.indexOf(tag.name) == -1) {
                classDisabled = " disabled"
            }

            if (this.props.unclickable) {
                return (
                    <div
                        className={'tag color-' + tag.color_hue + classClickable + classDisabled}
                        key={tag.name}
                    >
                        {searchIcon}
                        {tag.name}
                    </div>
                )
            }

            return (
                <button
                    className={'tag color-' + tag.color_hue + classClickable + classDisabled}
                    key={tag.name}
                    onClick={() => setQuery && setQuery("#" + tag.name)}
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
