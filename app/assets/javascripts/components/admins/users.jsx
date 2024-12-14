import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import I18n from '@js/modules/translations';

import {
    fetchUsers
} from '@js/actions/userActions';

import Loader from '@js/components/theme/loader';
import Table from '@js/components/theme/table';


class AdminUsers extends React.Component {
    static propTypes = {
        // from connect
        users: PropTypes.array,
        isFetching: PropTypes.bool,
        fetchUsers: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchUsers({order: 'created_desc', complete: true}, {}, {noCache: true});
    }

    render() {
        if (!this.props.users || this.props.isFetching) {
            return (
                <div>
                    <h1 className="center-align">
                        {I18n.t('js.admin.users.title')}
                    </h1>

                    <div className="center">
                        <Loader size="big"/>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <h1 className="center-align">
                    {I18n.t('js.admin.users.title')} ({this.props.users.length})
                </h1>

                <Table title={I18n.t('js.admin.users.table.title')}
                       locale={I18n.locale}
                       data={this.props.users.map((user) => ({ ...user}))}
                       columns={[
                           {
                               title: I18n.t('js.admin.users.table.columns.id'),
                               field: 'id',
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.users.table.columns.pseudo'),
                               field: 'pseudo',
                           },
                           {
                               title: I18n.t('js.admin.users.table.columns.email'),
                               field: 'email',
                           },
                           {
                               title: I18n.t('js.admin.users.table.columns.name'),
                               customFilterAndSearch: (term, user) => (user.firstName + ' ' + user.lastName).toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !== -1,
                               render: (user) => [user.firstName, user.lastName].filter(Boolean).join(' ')
                           },
                           {
                               title: I18n.t('js.admin.users.table.columns.created_at'),
                               field: 'createdAt',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.users.table.columns.last_sign_in_at'),
                               field: 'lastSignInAt',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.users.table.columns.locale'),
                               field: 'locale',
                               filtering: false,
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.users.table.columns.articles_count'),
                               field: 'articlesCount',
                               filtering: false,
                               width: 80
                           }
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
                       actions={[
                           {
                               icon: 'open_in_new',
                               tooltip: I18n.t('js.admin.common.open_link'),
                               onClick: (event, user) => window.open(user.link, '_blank')
                           }
                       ]}/>
            </div>
        );
    }
}

export default connect((state) => ({
    users: state.userState.users,
    isFetching: state.userState.isFetching
}), {
    fetchUsers
})(AdminUsers);