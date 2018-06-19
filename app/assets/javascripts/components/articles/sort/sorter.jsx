'use strict';

import {
    Link
} from 'react-router-dom';

import {
    SortableContainer,
    SortableElement,
    arrayMove
} from 'react-sortable-hoc';

import ArticleCardSort from './card';

const SortableItem = SortableElement(({article}) => (
        <ArticleCardSort article={article}/>
    )
);

const SortableList = SortableContainer(({articles}) => (
        <div className="article-sorting-items">
            {
                articles.map((article, i) => (
                        <SortableItem key={`article-sort-${article.id}`}
                                      index={i}
                                      article={article}/>
                    )
                )
            }
        </div>
    )
);

export default class ArticleSorterDisplay extends React.Component {
    static propTypes = {
        // Articles must already be sorted by priority
        articles: PropTypes.array.isRequired,
        topicSlug: PropTypes.string.isRequired,
        updateArticlePriority: PropTypes.func.isRequired
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
            <div className="article-sorting">
                <div className="row article-sorting-buttons">
                    <div className="col s12 m6 center-align">
                        <Link className="btn-flat waves-effect waves-teal"
                              to={`/user/${this.props.topicSlug}`}>
                            {I18n.t('js.helpers.buttons.cancel')}
                        </Link>
                    </div>

                    <div className="col s12 m6 center-align">
                        <a className="btn waves-effect waves-spectra"
                           href="#"
                           onClick={this._handleSavePriority}>
                            {I18n.t('js.helpers.buttons.apply')}
                        </a>
                    </div>
                </div>

                <SortableList articles={this.state.articles}
                              useWindowAsScrollContainer={true}
                              onSortEnd={this._handleSortEndProduct}/>
            </div>
        );
    }
}
