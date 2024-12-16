import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import ReactDiffViewer, {DiffMethod} from 'react-diff-viewer';

import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';

import {
    fetchArticle
} from '@js/actions/articleActions';

import AnalyticsService from '@js/modules/analyticsService';

import withRouter from '@js/components/modules/router';

import '@css/pages/article/compare.scss';


const stripTags = (string) => string?.replace(/(<([^>]+)>)/ig, '');
const diffRenderStyle = {display: 'inline'};


class TrackingCompareModal extends React.Component {
    static propTypes = {
        // from router
        routeNavigate: PropTypes.func,
        // from connect
        article: PropTypes.object,
        fetchArticle: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpen: true,
        firstLocale: this.props.article?.contentTranslations ? Object.keys(this.props.article.contentTranslations)[0] : '',
        secondLocale: this.props.article?.contentTranslations ? Object.keys(this.props.article.contentTranslations)[1] : ''
    };

    componentDidMount() {
        if (this.state.isOpen && this.props.article) {
            AnalyticsService.trackArticleComparePage(this.props.article.user.slug, this.props.article.slug);
        }

        if (this.props.article && !this.props.article.contentTranslations) {
            this.props.fetchArticle(this.props.article.user.id, this.props.article.id, {complete: true});
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

    _formatDiffRender = (str) => {
        return (
            <div style={diffRenderStyle}
                 dangerouslySetInnerHTML={{
                     __html: str
                 }}/>
        );
    };

    _handleLocaleChange = (localePosition, event) => {
        this.setState({
            [localePosition]: event.target.value
        });
    };

    _renderLocaleSelect = (name, localePosition) => {
        return (
            <FormControl className="article-compare-select">
                <InputLabel id={`${localePosition}-label`}>
                    {name}
                </InputLabel>

                <Select
                    labelId={`${localePosition}-label`}
                    id={localePosition}
                    value={this.state[localePosition]}
                    onChange={this._handleLocaleChange.bind(this, localePosition)}>
                    {
                        Object.keys(this.props.article.contentTranslations)
                            .map((locale) => (
                                <MenuItem key={locale}
                                          value={locale}>
                                    {locale}
                                </MenuItem>
                            ))
                    }
                </Select>
            </FormControl>
        );
    };

    render() {
        if (!this.props.article) {
            return null;
        }

        return (
            <Modal open={this.state.isOpen}
                   onClose={this._handleClose}>
                <div className="article-compare-modal">
                    {
                        Utils.isEmpty(this.props.article.contentTranslations)
                            ?
                            <>
                                <Typography className="article-compare-title"
                                            variant="h6">
                                    {I18n.t('js.article.compare.nothing')}
                                </Typography>

                                <div className="center-align margin-top-20">
                                    <div className="center-align margin-top-25">
                                        <a href="#"
                                           onClick={this._handleClose}>
                                            {I18n.t('js.article.compare.cancel')}
                                        </a>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <Typography className="article-compare-title"
                                            variant="h6">
                                    {I18n.t('js.article.compare.title')}
                                </Typography>

                                <div className="row center-align margin-top-20">
                                    <div className="col s12 m6">
                                        {this._renderLocaleSelect(I18n.t('js.article.compare.first_locale'), 'firstLocale')}
                                    </div>

                                    <div className="col s12 m6">
                                        {this._renderLocaleSelect(I18n.t('js.article.compare.second_locale'), 'secondLocale')}
                                    </div>
                                </div>

                                <div className="center-align margin-top-20">
                                    <ReactDiffViewer splitView={true}
                                                     hideLineNumbers={true}
                                                     useDarkTheme={false}
                                                     compareMethod={DiffMethod.TRIMMED_LINES}
                                                     renderContent={this._formatDiffRender}
                                                     oldValue={stripTags(this.props.article.contentTranslations[this.state.firstLocale])}
                                                     newValue={stripTags(this.props.article.contentTranslations[this.state.secondLocale])}/>
                                </div>

                                <div className="center-align margin-top-20">
                                    <div className="center-align margin-top-25">
                                        <a href="#"
                                           onClick={this._handleClose}>
                                            {I18n.t('js.article.compare.cancel')}
                                        </a>
                                    </div>
                                </div>
                            </>
                    }
                </div>
            </Modal>
        );
    }
}

export default connect((state) => ({
    article: state.articleState.article
}), {
    fetchArticle
})(withRouter({navigate: true})(TrackingCompareModal));