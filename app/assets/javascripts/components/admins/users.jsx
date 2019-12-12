'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    fetchUsers
} from '../../actions';

import Loader from '../theme/loader';
import Table from '../theme/table';

export default @connect((state) => ({
    users: state.userState.users
}), {
    fetchUsers
})
@hot
class AdminUsers extends React.Component {
    static propTypes = {
        // from connect
        users: PropTypes.array,
        fetchUsers: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchUsers({complete: true});
    }

    render() {
        if (!this.props.users || this.props.users.length === 0) {
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
                    {I18n.t('js.admin.users.title')}
                </h1>

                <Table title={I18n.t('js.admin.users.table.title')}
                       locale={I18n.locale}
                       data={this.props.users.map((user) => Object.assign({}, user))}
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
                               filtering: false
                           }
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

