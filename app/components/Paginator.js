var React = require('react');

var Paginator = React.createClass({

    hasNext: function() {
        return this.props.current != this.props.last;
    },

    hasPrevious: function() {
        return this.props.current != 1;
    },

    handleNext: function() {
        if (this.hasNext()) {
            this.props.setCurrentPage(this.props.current + 1);
        }
    },

    handlePrevious: function() {
        if (this.hasPrevious()) {
            this.props.setCurrentPage(this.props.current - 1);
        }
    },

    handleFirst: function() {
        if (this.hasPrevious()) {
            this.props.setCurrentPage(1);
        }
    },

    handleLast: function() {
        if (this.hasNext()) {
            this.props.setCurrentPage(this.props.last);
        }
    },

    render: function() {
        var hasNext = this.hasNext();
        var hasPrevious = this.hasPrevious();

        return (
            <div className="paginator-controls controls">
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
        );
    }
});

module.exports = Paginator;
