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
    fetchTag,
    updateTag
} from '../../actions';

import {
    getCurrentUser,
    getTagErrors
} from '../../selectors';

import Loader from '../theme/loader';

import HeadLayout from '../layouts/head';
import NotAuthorized from '../layouts/notAuthorized';

import TagFormDisplay from './display/form';
import TagErrorField from './display/fields/error';

import styles from '../../../jss/tag/edit';

export default @withRouter
@connect((state) => ({
    metaTags: state.tagState.metaTags,
    tag: state.tagState.tag,
    currentUser: getCurrentUser(state),
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
        metaTags: PropTypes.object,
        tag: PropTypes.object,
        currentUser: PropTypes.object,
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

    values = (values) => {
        values.id = this.props.tag.id;

        this.props.updateTag(values)
            .then((response) => {
                if (response.tag) {
                    this.props.history.push({
                        pathname: `/tags/${response.tag.slug}`,
                        state: {reloadTags: true}
                    });
                }
            });

        return true;
    };

    render() {
        if (this.props.tagErrors) {
            return (
                <div>
                    <TagErrorField errors={this.props.tagErrors}/>
                </div>
            );
        }

        if (!this.props.tag || !this.props.currentUser) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            );
        }

        if (!this.props.currentUser || this.props.currentUser.id !== this.props.tag.user.id) {
            return (
                <div className="center margin-top-20">
                    <NotAuthorized/>
                </div>
            )
        }

        return (
            <div className={this.props.classes.root}>
                <HeadLayout metaTags={this.props.metaTags}/>

                <TagFormDisplay id={`tag-edit-${this.props.tag.id}`}
                                tagId={this.props.tag}
                                isEditing={true}
                                onSubmit={this._handleSubmit}>
                    {this.props.tag}
                </TagFormDisplay>
            </div>
        );
    }
}
