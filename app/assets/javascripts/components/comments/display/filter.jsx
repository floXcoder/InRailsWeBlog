'use strict';

import {
    fetchComments
} from '../../../actions';

import Select from '../../materialize/select';
import Checkbox from '../../materialize/checkbox';
import Submit from '../../materialize/submit';

@connect(null, {
    fetchComments
})
export default class CommentFilterDisplay extends React.Component {
    static propTypes = {
        filters: PropTypes.object,
        // From connect
        fetchComments: PropTypes.func
    };

    static defaultProps = {
        filters: {}
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    _handleCommentSubmit = (event) => {
        event.preventDefault();

        let submitData = {
            complete: true
        };

        const form = event.target;
        const data = new FormData(form);

        for (let name of data.keys()) {
            submitData[name] = data.get(name);
        }

        this.props.fetchComments({filter: submitData});
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
                                    name="order"
                                    title={I18n.t('js.comment.table.filter.order.title')}
                                    default={I18n.t('js.comment.table.filter.order.select.default')}
                                    options={I18n.t('js.comment.table.filter.order.select.values')}
                                    optionsOrder={I18n.t('js.comment.table.filter.order.select.order')}/>
                        </div>

                        <div className="col s3">
                            <Checkbox id="filter_not_accepted"
                                      name="not_accepted"
                                      className="center-align margin-top-30"
                                      title={I18n.t('js.comment.table.filter.not_accepted')}>
                                {false}
                            </Checkbox>
                        </div>

                        <div className="col s3">
                            <Checkbox id="filter_ask_for_deletion"
                                      name="ask_for_deletion"
                                      className="center-align margin-top-30"
                                      title={I18n.t('js.comment.table.filter.ask_for_deletion')}>
                                {false}
                            </Checkbox>
                        </div>

                        <div className="col s2">
                            <div className="input-field center-align">
                                <Submit id="filter-submit">
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

