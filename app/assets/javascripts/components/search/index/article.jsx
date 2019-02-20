'use strict';

import {
    lazy,
    Suspense
} from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import DashboardIcon from '@material-ui/icons/Dashboard';
import SortIcon from '@material-ui/icons/Sort';

import Dropdown from '../../theme/dropdown';

import ArticleItemDisplay from './articles/item';

const ArticleGridMode = lazy(() => import(/* webpackChunkName: "article-search-masonry" */ './display/grid'));

export default class SearchArticleIndex extends React.PureComponent {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        articles: PropTypes.array.isRequired,
        onOrderChange: PropTypes.func.isRequired,
        onDisplayChange: PropTypes.func.isRequired,
        searchDisplay: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    state = {
        display: this.props.searchDisplay || 'card',
        order: 'priority'
    };

    _handleDisplay = (display, event) => {
        event.preventDefault();

        this.setState({
            display
        });

        this.props.onDisplayChange(display);
    };

    _handleOrder = (order, event) => {
        event.preventDefault();

        this.setState({
            order
        });

        this.props.onOrderChange(order);
    };

    render() {
        return (
            <div className={this.props.classes.category}>
                <Grid className={this.props.classes.categoryHeader}
                      container={true}
                      spacing={32}
                      direction="row"
                      justify="space-between"
                      alignItems="flex-end">
                    <Grid item={true}
                          className={this.props.classes.categoryItem}>
                        <h2 className={this.props.classes.categoryTitle}>
                            {I18n.t('js.search.index.articles.title')}
                        </h2>

                        <span className={this.props.classes.categoryCount}>
                            {`(${I18n.t('js.search.index.results', {count: this.props.articles.length})})`}
                        </span>
                    </Grid>

                    <Grid item={true}>
                        <Grid container={true}
                              spacing={16}
                              direction="row"
                              justify="flex-end"
                              alignItems="flex-end">
                            <Grid item={true}
                                  className={this.props.classes.categoryItem}>
                                <Dropdown position="bottom right"
                                          isClosingOnInsideClick={true}
                                          hasArrow={true}
                                          button={
                                              <Button className={this.props.classes.categoryFilterButton}>
                                                  <DashboardIcon/>
                                              </Button>
                                          }>
                                    <ul className={this.props.classes.categoryFilterList}>
                                        <li className={classNames({
                                            [this.props.classes.categoryFilterSelected]: this.props.searchDisplay === 'card'
                                        })}>
                                            <a onClick={this._handleDisplay.bind(this, 'card')}>
                                                {I18n.t('js.search.display.card')}
                                            </a>
                                        </li>

                                        <li className="dropdown-divider">
                                            &nbsp;
                                        </li>

                                        <li className={classNames({
                                            [this.props.classes.categoryFilterSelected]: this.props.searchDisplay === 'grid'
                                        })}>
                                            <a onClick={this._handleDisplay.bind(this, 'grid')}>
                                                {I18n.t('js.search.display.grid')}
                                            </a>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </Grid>

                            <Grid item={true}
                                  className={this.props.classes.categoryItem}>
                                <Dropdown position="bottom right"
                                          isClosingOnInsideClick={true}
                                          hasArrow={true}
                                          button={
                                              <Button className={this.props.classes.categoryFilterButton}>
                                                  <SortIcon/>
                                              </Button>
                                          }>
                                    <ul className={this.props.classes.categoryFilterList}>
                                        <li className={classNames({
                                            [this.props.classes.categoryFilterSelected]: this.state.order === 'priority'
                                        })}>
                                            <a onClick={this._handleOrder.bind(this, 'priority')}>
                                                {I18n.t('js.search.orders.priority')}
                                            </a>
                                        </li>

                                        <li className="dropdown-divider">
                                            &nbsp;
                                        </li>

                                        <li className={classNames({
                                            [this.props.classes.categoryFilterSelected]: this.state.order === 'date'
                                        })}>
                                            <a onClick={this._handleOrder.bind(this, 'date')}>
                                                {I18n.t('js.search.orders.date')}
                                            </a>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <div>
                    {
                        this.state.display === 'grid'
                            ?
                            <Suspense fallback={<div/>}>
                                <ArticleGridMode>
                                    {this.props.articles}
                                </ArticleGridMode>
                            </Suspense>
                            :
                            this.props.articles.map((article) => (
                                <ArticleItemDisplay key={article.id}
                                                    article={article}/>
                            ))
                    }
                </div>
            </div>
        );
    }
}
