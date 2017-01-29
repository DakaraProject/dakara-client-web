var React = require('react');

var SearchBox = React.createClass({
    getInitialState: function() {
        return {
            query: ""
        };
    },

    handleQueryChange: function(e) {
        this.setState({query: e.target.value});
    },

    handleSubmit: function(e) {
        e.preventDefault();
        this.handleSearch();
    },

    handleSearch: function() {
        this.props.setQuery(this.state.query);
    },

    handleClear: function() {
        this.setState({query: ''});                
        this.props.setQuery('');
    },

    setQuery: function(query) {
        this.setState({query: query});
    },

    render: function() {
        return (
            <form id="library-searchbox" onSubmit={this.handleSubmit}>
                <div className="field">
                    <div className="fake-input">
                        <input type="text" value={this.state.query} onChange={this.handleQueryChange} placeholder={this.props.placeholder}/>
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
        );
    }
});

module.exports = SearchBox; 
