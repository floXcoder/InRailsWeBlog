import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {
    showTagPath
} from '@js/constants/routesHelper';

import {
    fetchTag,
    updateTag
} from '@js/actions/tagActions';

import {
    getTagErrors
} from '@js/selectors/tagSelectors';

import withRouter from '@js/components/modules/router';

import Loader from '@js/components/theme/loader';

import NotAuthorized from '@js/components/layouts/notAuthorized';

import TagFormDisplay from '@js/components/tags/display/form';
import TagErrorField from '@js/components/tags/display/fields/error';

import '@css/pages/tag/form.scss';


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

export default connect((state) => ({
    currentUser: state.userState.user,
    isFetching: state.tagState.isFetching,
    tag: state.tagState.tag,
    tagErrors: getTagErrors(state)
}), {
    fetchTag,
    updateTag
})(withRouter({
    params: true,
    navigate: true
})(TagEdit));