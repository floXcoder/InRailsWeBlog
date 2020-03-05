'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withRouter
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    showTagPath
} from '../../constants/routesHelper';

import {
    fetchTag,
    updateTag
} from '../../actions';

import {
    getCurrentUser,
    getTagErrors
} from '../../selectors';

import Loader from '../theme/loader';

import NotAuthorized from '../layouts/notAuthorized';

import TagFormDisplay from './display/form';
import TagErrorField from './display/fields/error';

import styles from '../../../jss/tag/edit';

export default @withRouter
@connect((state) => ({
    currentUser: getCurrentUser(state),
    isFetching: state.tagState.isFetching,
    tag: state.tagState.tag,
    tagErrors: getTagErrors(state)
}), {
    fetchTag,
    updateTag
})
@hot
@withStyles(styles)
class TagEdit extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        // from router
        history: PropTypes.object,
        // from connect
        currentUser: PropTypes.object,
        isFetching: PropTypes.bool,
        tag: PropTypes.object,
        tagErrors: PropTypes.array,
        fetchTag: PropTypes.func,
        updateTag: PropTypes.func,
        // from styles
        classes: PropTypes.object
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
                    this.props.history.push({
                        pathname: showTagPath(response.tag.slug),
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
            )
        }

        return (
            <div className={this.props.classes.root}>
                {
                    this.props.tagErrors &&
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
