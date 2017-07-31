'use strict';

import _ from 'lodash';

import CommentAction from '../../../actions/commentActions';

import Select from '../../materialize/select';
import Checkbox from '../../materialize/checkbox';
import Submit from '../../materialize/submit';

import 'jquery-serializejson';

export default class CommentFilterDisplay extends React.Component {
    static propTypes = {
        filters: PropTypes.object
    };

    static defaultProps = {
        filters: {}
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    _handleCommentSubmit = (event) => {
        event.preventDefault();

        let filters = $('#filter_comment').serializeJSON();
        CommentAction.loadComments(_.merge(filters, {complete: true}));
    };

    render() {
        return (
            <div className="card comment-filter">
                <form id="filter_comment"
                      className="comment-form"
                      onSubmit={this._handleCommentSubmit}>
                    <div className="row filter-form">
                        <div className="col s4">
                            <Select id="filter_order"
                                    title={I18n.t('js.comment.table.filter.order.title')}
                                    default={I18n.t('js.comment.table.filter.order.select.default')}
                                    options={I18n.t('js.comment.table.filter.order.select.values')}
                                    optionsOrder={I18n.t('js.comment.table.filter.order.select.order')}/>
                        </div>

                        <div className="col s3">
                            <Checkbox id="filter_accepted"
                                      title={I18n.t('js.comment.table.filter.accepted')}>
                                {this.props.filters.accepted ? this.props.filters.accepted === 'true' : true}
                            </Checkbox>
                        </div>

                        <div className="col s3">
                            <Checkbox id="filter_accepted"
                                      title={I18n.t('js.comment.table.filter.ask_for_deletion')}>
                                {this.props.filters.ask_for_deletion ? this.props.filters.ask_for_deletion === 'true' : true}
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
}

