import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import I18n from '@js/modules/translations';

import {
    fetchComments
} from '@js/actions/commentActions';

import Loader from '@js/components/theme/loader';
import Table from '@js/components/theme/table';


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
        this.props.fetchComments({
            order: 'created_desc',
            complete: true,
            limit: 2000
        }, {noCache: true});
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
                       isPaginated={true}
                       data={this.props.comments.map((comment) => ({...comment}))}
                       columns={[
                           {
                               name: I18n.t('js.admin.comments.table.columns.id'),
                               key: 'id',
                               hidden: true
                           },
                           {
                               name: I18n.t('js.admin.comments.table.columns.title'),
                               key: 'title'
                           },
                           {
                               name: I18n.t('js.admin.comments.table.columns.body'),
                               key: 'body'
                           },
                           {
                               name: I18n.t('js.admin.comments.table.columns.posted_at'),
                               key: 'postedAt'
                           }
                       ]}/>
            </div>
        );
    }
}

export default connect((state) => ({
    comments: state.commentState.comments,
    isFetching: state.commentState.isFetching
}), {
    fetchComments
})(AdminComments)