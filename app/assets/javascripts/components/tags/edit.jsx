'use strict';

import {
    Link
} from 'react-router-dom';

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

@connect((state) => ({
    isFetching: state.tagState.isFetching,
    tag: state.tagState.tag,
    currentUser: getCurrentUser(state),
    tagErrors: getTagErrors(state)
}), {
    fetchTag,
    updateTag
})
export default class TagEdit extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        multipleId: PropTypes.number,
        // From connect
        isFetching: PropTypes.bool,
        tag: PropTypes.object,
        currentUser: PropTypes.object,
        tagErrors: PropTypes.array,
        fetchTag: PropTypes.func,
        updateTag: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchTag(this.props.params.tagSlug);
    }

    _handleSubmit = (values) => {
        let formData = values.toJS();

        formData.id = this.props.tag.id;

        this.props.updateTag(formData)
            .then((response) => {
                if (response.tag) {
                    this.props.history.push({
                        pathname: `/tag/${response.tag.slug}`,
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

        return (
            <div className="blog-form blog-tag-edit">
                <TagFormDisplay id={`tag-edit-${this.props.tag.id}`}
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
