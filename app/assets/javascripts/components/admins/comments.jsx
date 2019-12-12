'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    fetchComments
} from '../../actions';

import Loader from '../theme/loader';
import Table from '../theme/table';

export default @connect((state) => ({
    comments: state.commentState.comments
}), {
    fetchComments
})
@hot
class AdminComments extends React.Component {
    static propTypes = {
        // from connect
        comments: PropTypes.array,
        fetchComments: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchComments({complete: true});
    }

    render() {
        if (!this.props.comments) {
            return (
                <div className="center">
                    <Loader size="big"/>
                </div>
            );
        }

        return (
            <div>
                <h1 className="center-align">
                    {I18n.t('js.admin.comments.title')}
                </h1>

                <Table title={I18n.t('js.admin.comments.table.title')}
                       locale={I18n.locale}
                       data={this.props.comments.map((comment) => Object.assign({}, comment))}
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
                           pageSize: 50,
                           pageSizeOptions: [50, 100, 200],
                           emptyRowsWhenPaging: false
                       }}
                       actions={[
                       ]}/>
            </div>
        );
    }
}

