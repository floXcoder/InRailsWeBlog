'use strict';

import '../../../stylesheets/pages/tag/form.scss';

import {
    showTagPath
} from '../../constants/routesHelper';

import {
    fetchTag,
    updateTag
} from '../../actions';

import {
    getTagErrors
} from '../../selectors';

import withRouter from '../modules/router';

import Loader from '../theme/loader';

import NotAuthorized from '../layouts/notAuthorized';

import TagFormDisplay from './display/form';
import TagErrorField from './display/fields/error';


export default @connect((state) => ({
    currentUser: state.userState.user,
    isFetching: state.tagState.isFetching,
    tag: state.tagState.tag,
    tagErrors: getTagErrors(state)
}), {
    fetchTag,
    updateTag
})
@withRouter({params: true, navigate: true})
class TagEdit extends React.Component {
    static propTypes = {
        // from router
        routeParams: PropTypes.object,
        routeNavigate: PropTypes.func,
        // from connect
        currentUser: PropTypes.object,
        isFetching: PropTypes.bool,
        tag: PropTypes.object,
        tagErrors: PropTypes.array,
        fetchTag: PropTypes.func,
        updateTag: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchTag(this.props.routeParams.tagSlug, {edit: true});
    }

    _handleSubmit = (values) => {
        values.id = this.props.tag.id;

        return this.props.updateTag(values)
            .then((response) => {
                if (response.tag) {
                    this.props.routeNavigate({
                        pathname: showTagPath(response.tag.slug)
                    }, {
                        state: {reloadTags: true}
                    });
                }
            });
    };

    render() {
        if (!this.props.tag || !this.props.currentUser || this.props.isFetching) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            );
        }

        if (this.props.currentUser.id !== this.props.tag.user.id) {
            return (
                <div className="center margin-top-20">
                    <NotAuthorized/>
                </div>
            );
        }

        return (
            <div className="tag-edit-root">
                {
                    !!this.props.tagErrors &&
                    <div>
                        <TagErrorField errors={this.props.tagErrors}/>
                    </div>
                }

                <TagFormDisplay onSubmit={this._handleSubmit}>
                    {this.props.tag}
                </TagFormDisplay>
            </div>
        );
    }
}
