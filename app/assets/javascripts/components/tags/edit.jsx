'use strict';

import {
    hot
} from 'react-hot-loader';

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

import TagFormDisplay from './display/form';

import NotAuthorized from '../layouts/notAuthorized';

import styles from '../../../jss/tag/edit';

export default @hot(module)

@connect((state) => ({
    tag: state.tagState.tag,
    currentUser: getCurrentUser(state),
    tagErrors: getTagErrors(state)
}), {
    fetchTag,
    updateTag
})
@withStyles(styles)
class TagEdit extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        // from connect
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
        this.props.fetchTag(this.props.params.tagSlug, {edit: true});
    }

    _handleSubmit = (values) => {
        let formData = values.toJS();

        formData.id = this.props.tag.id;

        this.props.updateTag(formData)
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
        if (!this.props.tag) {
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

        const initialValues = this.props.tag.merge({});

        return (
            <div className={this.props.classes.root}>
                <TagFormDisplay initialValues={initialValues}
                                id={`tag-edit-${this.props.tag.id}`}
                                tagId={this.props.tag.id}
                                isEditing={true}
                                tagErrors={this.props.tagErrors}
                                onSubmit={this._handleSubmit}>
                    {this.props.tag}
                </TagFormDisplay>
            </div>
        );
    }
}
