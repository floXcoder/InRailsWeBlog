'use strict';

import {
    Link
} from 'react-router-dom';

import Button from '@material-ui/core/Button';

import arrayMove from 'array-move';

import {
    SortableContainer,
    SortableElement
} from 'react-sortable-hoc';

import {
    userArticlesPath
} from '../../../constants/routesHelper';

import ArticleCardSort from './card';

const SortableItem = SortableElement(({classes, article}) => (
        <ArticleCardSort classes={classes}
                         article={article}/>
    )
);

const SortableList = SortableContainer(({classes, articles}) => (
        <div className={classes.sortingItems}>
            {
                articles.map((article, i) => (
                    <SortableItem key={i}
                                  index={i}
                                  classes={classes}
                                  article={article}/>
                ))
            }
        </div>
    )
);

export default class ArticleSorter extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
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
            articles: arrayMove(this.state.articles, oldIndex, newIndex)
        });
    };

    _handleSavePriority = (event) => {
        event.preventDefault();

        this.props.updateArticlePriority(this.state.articles.map((article) => article['id']));
    };

    render() {
        return (
            <div className={this.props.classes.sorting}>
                <div className="row">
                    <div className="col s12 m6 center-align">
                        <Button color="default"
                                variant="outlined"
                                size="small"
                                component={Link}
                                to={userArticlesPath(this.props.currentUserSlug)}>
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

                <SortableList classes={this.props.classes}
                              articles={this.state.articles}
                              useWindowAsScrollContainer={true}
                              onSortEnd={this._handleSortEndProduct}/>
            </div>
        );
    }
}
