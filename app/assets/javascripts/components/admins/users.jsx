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
                       isPaginated={true}
                       data={this.props.users.map((user) => ({ ...user}))}
                       columns={[
                           {
                               name: I18n.t('js.admin.users.table.columns.id'),
                               key: 'id',
                               hidden: true
                           },
                           {
                               name: I18n.t('js.admin.users.table.columns.pseudo'),
                               key: 'pseudo'
                           },
                           {
                               name: I18n.t('js.admin.users.table.columns.email'),
                               key: 'email'
                           },
                           {
                               name: I18n.t('js.admin.users.table.columns.name'),
                               key: 'name',
                               customFilterAndSearch: (term, user) => (user.firstName + ' ' + user.lastName).toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !== -1,
                               value: (user) => [user.firstName, user.lastName].filter(Boolean).join(' ')
                           },
                           {
                               name: I18n.t('js.admin.users.table.columns.created_at'),
                               key: 'createdAt',
                               filtering: false
                           },
                           {
                               name: I18n.t('js.admin.users.table.columns.last_sign_in_at'),
                               key: 'lastSignInAt',
                               filtering: false
                           },
                           {
                               name: I18n.t('js.admin.users.table.columns.locale'),
                               key: 'locale',
                               filtering: false,
                               hidden: true
                           },
                           {
                               name: I18n.t('js.admin.users.table.columns.articles_count'),
                               key: 'articlesCount',
                               filtering: false,
                               width: 80
                           }
                       ]}
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