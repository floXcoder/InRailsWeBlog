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
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import {
    shareArticle
} from '../../actions';

import styles from '../../../jss/article/share';

export default @withRouter
@connect((state) => ({
    article: state.articleState.article
}), {
    shareArticle
})
@hot
@withStyles(styles)
class ShareArticleModal extends React.Component {
    static propTypes = {
        // from router
        history: PropTypes.object,
        // from connect
        article: PropTypes.object,
        shareArticle: PropTypes.func,
        // from styles
        classes: PropTypes.object
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

        this.props.history.push({
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
                <div className={this.props.classes.modal}>
                    <Typography className={this.props.classes.title}
                                variant="h6">
                        {I18n.t('js.article.share.title')}
                    </Typography>

                    <div className="center-align margin-top-20">
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
                                        variant="outlined"
                                        onClick={this._handleShareSubmit}>
                                    {I18n.t('js.article.share.button')}
                                </Button>
                        }

                        <div className="center-align margin-top-25">
                            <a href="#"
                               onClick={this._handleClose}>
                                {I18n.t('js.article.share.cancel')}
                            </a>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
