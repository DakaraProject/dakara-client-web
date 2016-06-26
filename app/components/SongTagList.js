var React = require('react');

var SongTagList = React.createClass({
    handleSearch: function(tagName) {
        if (this.props.setSearch) {
            this.props.setSearch("#" + tagName);
        }
    },

    render: function() {
        var tags = this.props.tags;
        var classExtra = "";
        var handleSearch;
        var searchIcon;
        if (this.props.setSearch) {
            classExtra = " clickable";
            handleSearch = function(base, tagName) {
                return this.handleSearch.bind(base, tagName);
            }.bind(this);
            searchIcon = (<i className="fa fa-search"></i>);
        } else {
            handleSearch = function(base, tagName) {};
        }

        var tagList = tags.map(function(tag) {
            var boundClick = handleSearch(this, tag.name);

            return (
                    <div className={'tag tag-color-' + tag.color_id + classExtra} key={tag.name} onClick={boundClick}>
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
