import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import I18n from '@js/modules/translations';

import {
    shareArticle
} from '@js/actions/shareActions';

import AnalyticsService from '@js/modules/analyticsService';

import withRouter from '@js/components/modules/router';

import '@css/pages/article/share.scss';


class ShareArticleModal extends React.Component {
    static propTypes = {
        // from router
        routeNavigate: PropTypes.func,
        // from connect
        article: PropTypes.object,
        shareArticle: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpen: true
    };

    componentDidMount() {
        if (this.state.isOpen && this.props.article) {
            AnalyticsService.trackArticleSharePage(this.props.article.user.slug, this.props.article.slug);
        }
    }

    _handleClose = () => {
        this.setState({
            isOpen: false
        });

        this.props.routeNavigate({
            hash: undefined
        });
    };

    _handleShareSubmit = () => {
        this.props.shareArticle(this.props.article.id);
    };

    render() {
        if (!this.props.article) {
            return null;
        }

        return (
            <Modal open={this.state.isOpen}
                   onClose={this._handleClose}>
                <div className="article-share-modal">
                    <Typography className="article-share-title"
                                variant="h6">
                        {I18n.t('js.article.share.title')}
                    </Typography>

                    <div className="center-align margin-top-30">
                        {
                            this.props.article.publicShareLink
                                ?
                                <div>
                                    <p>
                                        {I18n.t('js.article.share.content')}
                                    </p>
                                    <strong>
                                        <a href={this.props.article.publicShareLink}
                                           target="_blank">
                                            {this.props.article.publicShareLink}
                                        </a>
                                    </strong>
                                </div>
                                :
                                <Button color="primary"
                                        variant="contained"
                                        onClick={this._handleShareSubmit}>
                                    {I18n.t('js.article.share.button')}
                                </Button>
                        }

                        <div className="center-align margin-top-35">
                            <Button variant="text"
                                    href="#"
                                    onClick={this._handleClose}>
                                {I18n.t('js.article.share.cancel')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default connect((state) => ({
    article: state.articleState.article
}), {
    shareArticle
})(withRouter({navigate: true})(ShareArticleModal));