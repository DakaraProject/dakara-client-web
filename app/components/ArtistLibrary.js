import $ from 'jquery';
import React from 'react';
import ArtistLibraryEntry from './ArtistLibraryEntry';
import SearchBox from './SearchBox';
import Paginator from './Paginator';
import utils from '../dakara-utils';

var ArtistLibrary = React.createClass({
    getInitialState: function() {
        return {
            libraryEntries: {
                current: 1,
                count: 0,
                results: [],
            },
        };
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
        var url = utils.params.url + "library/artists/?page=" + this.props.libraryParams.page + "&query=" + encodeURIComponent(this.props.libraryParams.query)
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
            return (<ArtistLibraryEntry
                        key={entry.id}
                        artist={entry}
                        query={this.state.libraryEntries.query}
                    />);
        }.bind(this));
        var count = this.state.libraryEntries.count;

        return (
        <div id="artist-library" className="library">
            <SearchBox
                ref="searchBox"
                setQuery={this.setQuery}
                placeholder="Who are you looking for?"
            />
            <ul id="library-entries" className="listing">
                {list}
            </ul>
            <nav id="paginator">
                <Paginator
                    current={this.state.libraryEntries.current}
                    last={this.state.libraryEntries.last}
                    setCurrentPage={this.setCurrentPage}
                />
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

module.exports = ArtistLibrary;
