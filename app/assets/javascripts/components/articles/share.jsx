'use strict';

import '../../../stylesheets/pages/article/share.scss';

import {
    hot
} from 'react-hot-loader/root';

import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import {
    shareArticle
} from '../../actions';

import withRouter from '../modules/router';


export default @connect((state) => ({
    article: state.articleState.article
}), {
    shareArticle
})
@withRouter({navigate: true})
@hot
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
                            <Button variant="text" href="#" onClick={this._handleClose}>
                                {I18n.t('js.article.share.cancel')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
