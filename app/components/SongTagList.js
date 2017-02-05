var React = require('react');

var SongTagList = React.createClass({
    handleSearch: function(tagName) {
        if (this.props.setQuery) {
            this.props.setQuery("#" + tagName);
        }
    },

    render: function() {
        var tags = this.props.tags;
        var classClickable = "";
        var handleSearch;
        var searchIcon;
        if (this.props.setQuery) {
            classClickable = " clickable";
            handleSearch = function(base, tagName) {
                return this.handleSearch.bind(base, tagName);
            }.bind(this);
            searchIcon = (<i className="fa fa-search"></i>);
        } else {
            handleSearch = function(base, tagName) {};
        }

        var tagList = tags.map(function(tag) {
            var boundClick = handleSearch(this, tag.name);
            var classDisabled = "";
            if (this.props.query && this.props.query.tags.length && this.props.query.tags.indexOf(tag.name) == -1) {
                classDisabled = " disabled";
            }

            return (
                    <div className={'tag tag-color-' + tag.color_id + classClickable + classDisabled} key={tag.name} onClick={boundClick}>
                        {searchIcon}
                        {tag.name}
                    </div>
                    );
        }.bind(this));

        return (
                <div className="song-tag-list">
                    {tagList}
                </div>
                );
    }
});

module.exports = SongTagList;
