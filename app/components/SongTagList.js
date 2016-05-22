var React = require('react');

var SongTagList = React.createClass({
    render: function() {
        var tags = this.props.tags;
        var tagList = tags.map(function(tag) {
            return (
                    <div className={'tag tag-color-' + tag.color_id}>
                        {tag.name}
                    </div>
                    );
        });

        return (
                <div className="song-tag-list">
                    {tagList}
                </div>
                );
    }
});

module.exports = SongTagList;
