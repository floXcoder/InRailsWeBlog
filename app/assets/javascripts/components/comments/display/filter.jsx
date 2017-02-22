'use strict';

const CommentAction = require('../../../actions/commentActions');

const Select = require('../../materialize/select');
const Checkbox = require('../../materialize/checkbox');
const Submit = require('../../materialize/submit');

require('jquery-serializejson');

var CommentFilterDisplay = React.createClass({
    propTypes: {
        filters: React.PropTypes.object
    },

    getDefaultProps () {
        return {
            filters: {}
        };
    },

    shouldComponentUpdate (nextProps, nextState) {
        return false;
    },

    _handleCommentSubmit (event) {
        event.preventDefault();

        let filters = $(ReactDOM.findDOMNode(this.refs.filterForm)).serializeJSON();
        CommentAction.loadComments(_.merge(filters, {complete: true}));
    },

    render () {
        return (
            <div className="card comment-filter">
                <form ref="filterForm"
                      id="filter_comment"
                      className="comment-form"
                      onSubmit={this._handleCommentSubmit}>
                    <div className="row filter-form">
                        <div className="col s5">
                            <Select id="filter_order"
                                    title={I18n.t('js.comment.table.filter.order.title')}
                                    default={I18n.t('js.comment.table.filter.order.select.default')}
                                    options={I18n.t('js.comment.table.filter.order.select.values')}
                                    optionsOrder={I18n.t('js.comment.table.filter.order.select.order')}/>
                        </div>

                        <div className="col s5">
                            <Checkbox id="filter_accepted"
                                      title={I18n.t('js.comment.table.filter.accepted')}>
                                {this.props.filters.accepted ? this.props.filters.accepted === 'true' : true}
                            </Checkbox>
                        </div>

                        <div className="col s2">
                            <div className="input-field center-align">
                                <Submit id="filter-submit"
                                        onClick={this._handleCommentSubmit}>
                                    {I18n.t('js.comment.table.filter.button')}
                                </Submit>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = CommentFilterDisplay;
