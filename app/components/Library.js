var $ = jQuery = require('jquery');
var React = require('react');
var LibraryEntry = require('./LibraryEntry');

var Library = React.createClass({
    getInitialState: function() {
        return {
            libraryEntries: {
                count: 0,
                results: [],
            },
            search: "",
            currentSearch: ""
        };
    },

    componentDidMount: function() {
        this.refreshEntries(this.props.url + "library/songs/");
    },

    handleNext: function() {
        this.refreshEntries(this.state.libraryEntries.next);
    },

    handlePrevious: function() {
        this.refreshEntries(this.state.libraryEntries.previous);
    },

    handleFirst: function() {
        if (this.state.libraryEntries.previous) {
            this.refreshEntries(this.props.url + "library/songs/?query=" + encodeURIComponent(this.state.currentSearch));
        }
    },

    handleLast: function() {
        if (this.state.libraryEntries.next) {
            this.refreshEntries(this.props.url + "library/songs/?page=last&query=" + encodeURIComponent(this.state.currentSearch));
        }
    },

    handleSearchChange: function(e) {
        this.setState({search: e.target.value});
    },

    handleSubmit: function(e) {
        e.preventDefault();
        this.handleSearch(e);
    },

    handleSearch: function(e) {
        this.refreshEntries(this.props.url + "library/songs/?query=" + encodeURIComponent(this.state.search));                
        this.setState({currentSearch: this.state.search});
    },

    handleClear: function(e) {
        this.setState({search: '', currentSearch: ''});                
        this.refreshEntries(this.props.url + "library/songs/");                
    },

    addToPlaylist: function(songId, callback) {
        $.ajax({
        url: this.props.url + "playlist/",
        dataType: 'json',
        type: 'POST',
        data: {"song": songId},
        success: function(data) {
            callback(true);
            this.props.loadStatusFromServer();
        }.bind(this),
        error: function(xhr, status, err) {
            callback(false);
            console.error(this.props.url, status, err.toString() + xhr.responseText);
        }.bind(this)
        }); 
    },

    refreshEntries: function(url) {
        if (url) {
            $.ajax({
              url: url,
              dataType: 'json',
              cache: false,
              success: function(data) {
                this.setState({libraryEntries: data});
              }.bind(this),
              error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
              }.bind(this)
            });
        }
    },

    render: function() {
        var currentTime = new Date().getTime();
        //compute time when each song is going to be played
        var remainingTime = 0;
        var playerStatus = this.props.playerStatus;
        var playingId;
        if (playerStatus.playlist_entry) {
            playingId = playerStatus.playlist_entry.song.id;
            remainingTime = playerStatus.playlist_entry.song.duration - playerStatus.timing;
        }
        var timeOfPlay = {};
        for(entry of this.props.playlistEntries.results){
            if (!timeOfPlay[entry.song.id]) {
                timeOfPlay[entry.song.id] = currentTime + remainingTime * 1000;
            }
            remainingTime += +(entry.song.duration);
        }

        var playListEndTime = currentTime + remainingTime * 1000;
        var addToPlaylist = this.addToPlaylist;
        var list = this.state.libraryEntries.results.map(function(entry){
            var isPlaying = entry.id == playingId;
            return (<LibraryEntry key={entry.id} song={entry} query={this.state.libraryEntries.query} timeOfPlay={timeOfPlay[entry.id]} isPlaying={isPlaying} addToPlaylist={addToPlaylist}/>);
        }.bind(this));
        var count = this.state.libraryEntries.count;
        var hasNext = this.state.libraryEntries.next;
        var hasPrevious = this.state.libraryEntries.previous;


        return (
        <div>
            <form id="query" onSubmit={this.handleSubmit}>
                <div className="field">
                    <div className="fake-input">
                        <input type="text" value={this.state.search} onChange={this.handleSearchChange} placeholder="What will you sing?"/>
                        <div className="controls">
                            <div className="clear control" onClick={this.handleClear}>
                                <i className="fa fa-times"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="controls">
                    <div className="search control primary" onClick={this.handleSearch}>
                        <i className="fa fa-search"></i>
                    </div>
                </div>
            </form>
            <div id="results">
                <ul id="results-listing" className="listing">
                    {list}
                </ul>
            </div>
            <nav id="paginator">
                <div className="controls">
                    <div className={"first control primary" + (hasPrevious? "" : " disabled")} onClick={this.handleFirst}>
                        <i className="fa fa-angle-double-left"></i>
                    </div>
                    <div className={"previous control primary" + (hasPrevious? "" : " disabled")} onClick={this.handlePrevious}>
                        <i className="fa fa-angle-left"></i>
                    </div>
                    <div className={"next control primary" + (hasNext? "" : " disabled")} onClick={this.handleNext}>
                        <i className="fa fa-angle-right"></i>
                    </div>
                    <div className={"last control primary" + (hasNext? "" : " disabled")} onClick={this.handleLast}>
                        <i className="fa fa-angle-double-right"></i>
                    </div>
                </div>
                <div className="info">
                    <div className="info-item" id="library-amount">
                        <span className="stat">{count}</span>
                        <span className="description">song{count == 1? '': 's'} found</span>
                    </div>
                </div>
            </nav>
        </div>
        );
    }
});

module.exports = Library;
