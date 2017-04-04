import React, { Component } from 'react'

export default class SongTagList extends Component {
    render() {
        var { tags, setQuery, query } = this.props
        var classClickable = ""
        var searchIcon
        if (setQuery) {
            classClickable = " clickable"
            searchIcon = (<i className="fa fa-search"></i>)
        }

        var tagList = tags.map(function(tag) {
            // Grey out tag when searching a tag other than this
            var classDisabled = ""
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
