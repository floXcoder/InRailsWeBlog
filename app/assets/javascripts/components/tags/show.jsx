'use strict';

const UserStore = require('../../stores/userStore');

const TagActions = require('../../actions/tagActions');
const TagStore = require('../../stores/tagStore');

const UserAvatarIcon = require('../users/icons/avatar');

import {Link} from 'react-router';

var TagShow = React.createClass({
    propTypes: {
        tag: React.PropTypes.object,
        params: React.PropTypes.object,
        location: React.PropTypes.object,
    },

    mixins: [
        Reflux.listenTo(TagStore, 'onTagChange')
    ],

    getDefaultProps () {
        return {
            tag: null,
            params: {},
            location: {}
        };
    },

    getInitialState () {
        return {
            tag: null
        };
    },

    componentWillMount () {
        if (this.props.tag) {
            this.setState({
                tag: this.props.tag
            });
        } else if (this.props.params.tagId) {
            TagActions.loadTag({id: this.props.params.tagId});
        }
    },

    onTagChange (tagData) {
        if ($.isEmpty(tagData)) {
            return;
        }

        let newState = {};

        if (tagData.type === 'loadTag') {
            newState.tag = tagData.tag;
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _handleAuthorClick (userId, event) {
        UserStore.onTrackClick(userId);
        return event;
    },

    // _handleDeleteClick (event) {
    //     event.preventDefault();
    //     if (this.state.article) {
    //         ArticleActions.deleteArticle({id: this.state.article.id, showMode: true});
    //     }
    // },

    render () {
        if ($.isEmpty(this.state.tag)) {
            return null;
        }

        return (
            <div>
                <div className="card blog-tag-item clearfix">
                    <div className="card-content">
                        <UserAvatarIcon user={this.state.tag.user}
                                        className="article-user"/>

                        <h1 className="center-align">
                            <span>
                                {this.state.tag.name}
                            </span>
                        </h1>

                        <p className="tag-item-description">
                            {
                                this.state.tag.description
                                    ?
                                    this.state.tag.description
                                    :
                                    <span className="tag-item-no-description">
                                            {I18n.t('js.tag.common.no_description')}
                                        </span>
                            }
                        </p>

                        <p className="tag-item-synonyms">
                            {
                                this.state.tag.synonyms
                                    ?
                                    this.state.tag.synonyms
                                    :
                                    <span className="tag-item-no-synonyms">
                                            {I18n.t('js.tag.common.no_synonyms')}
                                        </span>
                            }
                        </p>

                        <p className="tag-item-visibility">
                            {I18n.t('js.tag.model.visibility') + ': '}
                            {
                                this.state.tag.visibility_translated
                            }
                        </p>

                        <p className="tag-item-parents margin-bottom-20">
                            {I18n.t('js.tag.show.parents')}

                            {
                                this.state.tag.parents && this.state.tag.parents.length > 0
                                    ?
                                    this.state.tag.parents.map((tag, i) =>
                                        <Link key={i}
                                              className="waves-effect waves-light btn-small tag-parent"
                                              to={`/tag/${tag.slug}`}>
                                            {tag.name}
                                        </Link>
                                    )
                                    :
                                    <span className="tag-item-no-parents">
                                            {I18n.t('js.tag.common.no_parents')}
                                        </span>
                            }
                        </p>

                        <p className="tag-item-children margin-bottom-20">
                            {I18n.t('js.tag.show.children')}

                            {
                                this.state.tag.children && this.state.tag.children.length > 0
                                    ?
                                    this.state.tag.children.map((tag, i) =>
                                        <Link key={i}
                                              className="waves-effect waves-light btn-small tag-child"
                                              to={`/tag/${tag.slug}`}>
                                            {tag.name}
                                        </Link>
                                    )
                                    :
                                    <span className="tag-item-no-children">
                                            {I18n.t('js.tag.common.no_children')}
                                        </span>
                            }
                        </p>
                    </div>

                    <div className="card-action article-action clearfix">
                        <div className="row">
                            <div className="col s12 m12 l6 md-margin-bottom-20">
                                <Link to={`/`}
                                      className="btn btn-default">
                                    {I18n.t('js.tag.show.back_button')}
                                </Link>
                            </div>

                            <div className="col s12 m12 l6 right-align">
                                <Link className="waves-effect waves-light btn"
                                      to={`/tag/${this.state.tag.slug}/edit`}>
                                    {I18n.t('js.tag.show.edit_link')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = TagShow;
