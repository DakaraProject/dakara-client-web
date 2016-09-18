var $ = jQuery = require('jquery');
var React = require('react');
var ArtistLibraryEntry = require('./ArtistLibraryEntry');
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
        };
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
        url = utils.params.url + "library/artists/?page=" + this.state.currentPage + "&query=" + encodeURIComponent(this.state.currentQuery)
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
        var list = this.state.libraryEntries.results.map(function(entry){
            return (<ArtistLibraryEntry key={entry.id} artist={entry} query={this.state.libraryEntries.query} setSongQuery={this.setSongQuery}/>);
        }.bind(this));
        var count = this.state.libraryEntries.count;

        return (
        <div id="artist-library" className="library-item">
            <SearchBox ref="searchBox" setQuery={this.setQuery} placeholder="Who are you looking for?"/>
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
                        <span className="description">artist{count == 1? '': 's'} found</span>
                    </div>
                </div>
            </nav>
        </div>
        );
    }
});

module.exports = SongLibrary;
