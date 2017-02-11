import React from 'react';

export default class SearchBox extends React.Component {
    state = {
        query: ""
    }

    handleQueryChange = (e) => {
        this.setState({query: e.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.handleSearch();
    }

    handleSearch = () => {
        this.props.setQuery(this.state.query);
    }

    handleClear = () => {
        this.setState({query: ''});                
        this.props.setQuery('');
    }

    setQuery = (query) => {
        this.setState({query: query});
    }

    render() {
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
}
