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
            searchIcon = (<i className="fa fa-search"></i>)
        }

        const tagList = tags.map( tag => {
            // Grey out tag when searching a tag other than this
            let classDisabled = ""
            if (query && query.tags.length && query.tags.indexOf(tag.name) == -1) {
                classDisabled = " disabled"
            }

            return (
                    <div
                        className={'tag tag-color-' + tag.color_id + classClickable + classDisabled}
                        key={tag.name}
                        onClick={() => setQuery && setQuery("#" + tag.name)}
                    >
                        {searchIcon}
                        {tag.name}
                    </div>
                    )
        })

        return (
                <div className="song-tag-list">
                    {tagList}
                </div>
        )
    }
}
