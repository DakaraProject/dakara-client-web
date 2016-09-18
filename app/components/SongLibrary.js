var $ = jQuery = require('jquery');
var React = require('react');
var SongLibraryEntry = require('./SongLibraryEntry');
var SearchBox = require('./SearchBox');
var Paginator = require('./Paginator');
var utils = require('../dakara-utils');

var SongLibrary = React.createClass({
    getInitialState: function() {
        return {
            libraryEntries: {
                current: 1,
                count: 0,
                results: [],
            },
            currentPage: 1,
            currentQuery: "",
            expandedId: null
        };
    },

    setExpandedId: function(id) {
        this.setState({expandedId: id});  
    },

    setQuery: function(query) {
        this.setState({currentQuery: query, expandedId: null, currentPage: 1});
        this.refs['searchBox'].setQuery(query);
    },

    setCurrentPage: function(pageNumber) {
        this.setState({currentPage: pageNumber, expandedId: null});
    },

    componentDidMount: function() {
        this.refreshEntries();
    },

    componentDidUpdate: function(prevProps, prevState) {
        // Each time query or page is changed, refresh entries from server
        if (prevState.currentQuery != this.state.currentQuery || prevState.currentPage != this.state.currentPage) {
            this.refreshEntries();
        } 
    },

    refreshEntries: function() {
        url = utils.params.url + "library/songs/?page=" + this.state.currentPage + "&query=" + encodeURIComponent(this.state.currentQuery)
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({libraryEntries: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
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
        var addToPlaylist = this.props.addToPlaylist;
        var list = this.state.libraryEntries.results.map(function(entry){
            var isPlaying = entry.id == playingId;
            return (<SongLibraryEntry key={entry.id} song={entry} query={this.state.libraryEntries.query} timeOfPlay={timeOfPlay[entry.id]} isPlaying={isPlaying} addToPlaylist={addToPlaylist} setExpandedId={this.setExpandedId} setSearch={this.setQuery} expanded={this.state.expandedId == entry.id}/>);
        }.bind(this));
        var count = this.state.libraryEntries.count;

        return (
        <div id="song-library" className="library-item">
            <SearchBox ref="searchBox" setQuery={this.setQuery} placeholder="What will you sing?"/>
            <div id="results">
                <ul id="results-listing" className="listing">
                    {list}
                </ul>
            </div>
            <nav id="paginator">
                <Paginator current={this.state.libraryEntries.current} last={this.state.libraryEntries.last} setCurrentPage={this.setCurrentPage}/>
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

module.exports = SongLibrary;
