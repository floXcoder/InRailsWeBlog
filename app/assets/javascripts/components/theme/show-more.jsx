'use strict';

// const classNames = require('classnames');

var ShowMore = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        children: React.PropTypes.string.isRequired
    },

    getDefaultProps () {
        return {};
    },

    componentDidMount() {
        let $textContent = $(ReactDOM.findDOMNode(this.refs.showMoreText));
        let currentHeight = $textContent.height();

        if (currentHeight > 200) {
            $textContent.addClass('read-more-target');
            $(`#read-more-${this.props.id}`).find('label').show();
        } else {
            $(`#read-more-${this.props.id}`).find('label').hide();
        }
    },

    render () {
        return (
            <div ref="showMore"
                 id={`read-more-${this.props.id}`}>
                <input id={this.props.id}
                       type="checkbox"
                       className="read-more-state"/>

                <div className="read-more-wrap">
                    <div ref="showMoreText"
                         className="">
                        {this.props.children}
                    </div>
                </div>

                <label htmlFor={this.props.id}
                       className="read-more-trigger"/>
            </div>
        );
    }
});

module.exports = ShowMore;
