import $ from 'jquery';
import React from 'react';
import SongLibraryEntry from './SongLibraryEntry';
import SearchBox from './SearchBox';
import Paginator from './Paginator';
import utils from '../dakara-utils';

var SongLibrary = React.createClass({
    getInitialState: function() {
        return {
            libraryEntries: {
                current: 1,
                count: 0,
                results: [],
            },
        };
    },

    setExpandedId: function(id) {
        this.props.navigator.setExpanded(id);
    },

    setQuery: function(query) {
        /* Search a query
         *
         * @param query
         *  string to search
         */
        this.props.navigator.setQueryCurrent(query)
    },

    setCurrentPage: function(pageNumber) {
        /* Change the page
         * Is passed to the paginator
         *
         * @param pageNumber
         *  page number
         */
        this.props.navigator.setPage(pageNumber);
    },

    componentDidMount: function() {
        /* Listener for the component
         * When the component is initialized
         */
        this.refreshEntries();
        this.refs['searchBox'].setQuery(this.props.libraryParams.query);
    },

    componentDidUpdate: function(prevProps, prevState) {
        /* Listener for the component
         * When the component is updated
         */
        var queryHasChanged = prevProps.libraryParams.query != this.props.libraryParams.query;
        var pageHasChanged = prevProps.libraryParams.page != this.props.libraryParams.page;
        // Each time query or page is changed, refresh entries from server
        if (queryHasChanged || pageHasChanged) {
            this.refreshEntries();
        }
        // each time query changes, set the searchbox field
        if (queryHasChanged) {
            this.refs['searchBox'].setQuery(this.props.libraryParams.query);
        }
    },

    refreshEntries: function() {
        var url = utils.params.url + "library/songs/?page=" + this.props.libraryParams.page + "&query=" + encodeURIComponent(this.props.libraryParams.query)
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
        for(var entry of this.props.playlistEntries.results){
            if (!timeOfPlay[entry.song.id]) {
                timeOfPlay[entry.song.id] = currentTime + remainingTime * 1000;
            }
            remainingTime += +(entry.song.duration);
        }

        var playListEndTime = currentTime + remainingTime * 1000;
        var addToPlaylist = this.props.addToPlaylist;
        var list = this.state.libraryEntries.results.map(function(entry){
            var isPlaying = entry.id == playingId;
            return (<SongLibraryEntry
                        key={entry.id}
                        song={entry}
                        query={this.state.libraryEntries.query}
                        timeOfPlay={timeOfPlay[entry.id]}
                        isPlaying={isPlaying}
                        addToPlaylist={addToPlaylist}
                        setExpandedId={this.setExpandedId}
                        expanded={this.props.libraryParams.expanded == entry.id}
                    />);
        }.bind(this));
        var count = this.state.libraryEntries.count;

        return (
        <div id="song-library" className="library">
            <SearchBox ref="searchBox" setQuery={this.setQuery} placeholder="What will you sing?"/>
            <ul id="library-entries" className="listing">
                {list}
            </ul>
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
