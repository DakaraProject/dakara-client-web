var $ = jQuery = require('jquery');
var React = require('react');
var WorkLibraryEntry = require('./WorkLibraryEntry');
var SearchBox = require('./SearchBox');
var Paginator = require('./Paginator');
var utils = require('../dakara-utils');

var WorkLibrary = React.createClass({
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
        url = utils.params.url + "library/works/?type=" + this.props.type.query_name + "&page=" + this.props.libraryParams.page + "&query=" + encodeURIComponent(this.props.libraryParams.query)
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
            return (<WorkLibraryEntry
                        key={entry.id}
                        work={entry}
                        queryName={this.props.type.query_name}
                        query={this.state.libraryEntries.query}
                    />);
        }.bind(this));
        var count = this.state.libraryEntries.count;
        var statsCountDescription = this.props.type.name.toLowerCase() + (count == 1? '': 's')
        var libraryName = this.props.type.query_name;
        return (
        <div id={libraryName + "-library"} className="library">
            <SearchBox
                ref="searchBox"
                setQuery={this.setQuery}
                placeholder={"What " + this.props.type.name.toLowerCase() + " do you want?"}
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
                        <span className="description">{statsCountDescription} found</span>
                    </div>
                </div>
            </nav>
        </div>
        );
    }
});

module.exports = WorkLibrary;
