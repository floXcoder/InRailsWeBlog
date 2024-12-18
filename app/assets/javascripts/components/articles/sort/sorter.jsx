import React from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import Button from '@mui/material/Button';

import {
    arrayMoveImmutable
} from 'array-move';

import {
    SortableContainer,
    SortableElement
} from 'react-sortable-hoc';

import I18n from '@js/modules/translations';

import {
    userHomePath
} from '@js/constants/routesHelper';

import ArticleCardSort from '@js/components/articles/sort/card';

const SortableItem = SortableElement(({article}) => (
    <ArticleCardSort article={article}/>
));

const SortableList = SortableContainer(({articles}) => (
    <div className="article-sort-sorting-items">
        {
            articles.map((article, i) => (
                <SortableItem key={i}
                              index={i}
                              article={article}/>
            ))
        }
    </div>
));


export default class ArticleSorter extends React.Component {
    static propTypes = {
        // Articles must already be sorted by priority
        articles: PropTypes.array.isRequired,
        currentUserSlug: PropTypes.string.isRequired,
        updateArticlePriority: PropTypes.func.isRequired,
        isProcessing: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    state = {
        articles: this.props.articles
    };

    _handleSortEndProduct = ({oldIndex, newIndex}) => {
        this.setState({
            articles: arrayMoveImmutable(this.state.articles, oldIndex, newIndex)
        });
    };

    _handleSavePriority = (event) => {
        event.preventDefault();

        this.props.updateArticlePriority(this.state.articles.map((article) => article['id']));
    };

    render() {
        return (
            <div className="article-sort-sorting">
                <div className="row">
                    <div className="col s12 m6 center-align">
                        <Button
                            variant="outlined"
                            size="small"
                            component={Link}
                            to={userHomePath(this.props.currentUserSlug)}>
                            {I18n.t('js.helpers.buttons.cancel')}
                        </Button>
                    </div>

                    <div className="col s12 m6 center-align">
                        <Button color="primary"
                                variant="outlined"
                                disabled={this.props.isProcessing}
                                onClick={this._handleSavePriority}>
                            {I18n.t('js.helpers.buttons.apply')}
                        </Button>
                    </div>
                </div>

                <SortableList articles={this.state.articles}
                              useWindowAsScrollContainer={true}
                              onSortEnd={this._handleSortEndProduct}/>
            </div>
        );
    }
}
