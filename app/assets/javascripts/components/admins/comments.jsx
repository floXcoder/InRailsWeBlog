'use strict';

import {
    fetchComments
} from '../../actions';

import Loader from '../theme/loader';
import Table from '../theme/table';

export default @connect((state) => ({
    comments: state.commentState.comments,
    isFetching: state.commentState.isFetching
}), {
    fetchComments
})
class AdminComments extends React.Component {
    static propTypes = {
        // from connect
        comments: PropTypes.array,
        isFetching: PropTypes.bool,
        fetchComments: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchComments({order: 'created_desc', complete: true, limit: 2000}, {noCache: true});
    }

    render() {
        if (!this.props.comments || this.props.isFetching) {
            return (
                <div className="center">
                    <Loader size="big"/>
                </div>
            );
        }

        return (
            <div>
                <h1 className="center-align">
                    {I18n.t('js.admin.comments.title')} ({this.props.comments.length})
                </h1>

                <Table title={I18n.t('js.admin.comments.table.title')}
                       locale={I18n.locale}
                       data={this.props.comments.map((comment) => ({...comment}))}
                       columns={[
                           {
                               title: I18n.t('js.admin.comments.table.columns.id'),
                               field: 'id',
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.comments.table.columns.title'),
                               field: 'title',
                           },
                           {
                               title: I18n.t('js.admin.comments.table.columns.body'),
                               field: 'body',
                           },
                           {
                               title: I18n.t('js.admin.comments.table.columns.posted_at'),
                               field: 'postedAt',
                           },
                       ]}
                       options={{
                           columnsButton: true,
                           exportButton: true,
                           filtering: true,
                           actionsColumnIndex: -1,
                           pageSize: 100,
                           pageSizeOptions: [100, 500, 1000],
                           emptyRowsWhenPaging: false
                       }}
                       actions={[]}/>
            </div>
        );
    }
}

