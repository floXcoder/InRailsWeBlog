'use strict';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Hidden from '@mui/material/Hidden';
import TextField from '@mui/material/TextField';

import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SortIcon from '@mui/icons-material/Sort';
import FindInPageIcon from '@mui/icons-material/FindInPage';

import Dropdown from '../../../theme/dropdown';


export default class ArticleSearchMenuDisplay extends React.PureComponent {
    static propTypes = {
        articlesCount: PropTypes.number.isRequired,
        onSettingsClick: PropTypes.func.isRequired,
        onOrderChange: PropTypes.func.isRequired,
        onDisplayChange: PropTypes.func.isRequired,
        onURLSearchSubmit: PropTypes.func.isRequired,
        currentUserId: PropTypes.number,
        searchDisplay: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    state = {
        order: 'popularity'
    };

    _handleDisplay = (display, event) => {
        event.preventDefault();

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
            <Grid className="search-index-category-header"
                  container={true}
                  spacing={4}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end">
                <Grid item={true}
                      className="search-index-category-item">
                    <h2 className="search-index-category-title">
                        {I18n.t('js.search.index.articles.title')}
                    </h2>

                    <span className="search-index-category-count">
                        {`(${I18n.t('js.search.index.results', {count: this.props.articlesCount})})`}
                    </span>
                </Grid>

                <Hidden mdDown={true}>
                    <Grid item={true}
                          className="search-index-category-menu">
                        <Grid container={true}
                              spacing={2}
                              direction="row"
                              justifyContent="flex-end"
                              alignItems="flex-end">
                            {
                                !!this.props.currentUserId &&
                                <Grid item={true}
                                      className="search-index-category-item">
                                    <Dropdown id="search-filter"
                                              // tooltip={I18n.t('js.search.scrap.field')}
                                              button={
                                                  <Button className="search-index-category-filter-button">
                                                      <FindInPageIcon/>
                                                  </Button>
                                              }>
                                        <form noValidate={true}
                                              onSubmit={this.props.onURLSearchSubmit}>
                                            <ul className="search-index-category-filter-list">
                                                <li>
                                                    <TextField id="search-in-urls"
                                                               name="search[query_url]"
                                                               InputLabelProps={{
                                                                   className: 'search-index-categoryFilterInput'
                                                               }}
                                                               InputProps={{
                                                                   className: 'search-index-categoryFilterInput'
                                                               }}
                                                               FormHelperTextProps={{
                                                                   className: 'search-index-categoryFilterHelper'
                                                               }}
                                                               autoFocus={true}
                                                               variant="outlined"
                                                               label={I18n.t('js.search.scrap.field')}
                                                               helperText={I18n.t('js.search.scrap.helper')}/>
                                                </li>

                                                <li className="margin-top-10">
                                                    <div className="center-align">
                                                        <Button className="search-index-category-filter-button"
                                                                color="primary"
                                                                variant="text"
                                                                type="submit">
                                                            {I18n.t('js.search.scrap.button')}
                                                        </Button>
                                                    </div>
                                                </li>
                                            </ul>
                                        </form>
                                    </Dropdown>
                                </Grid>
                            }

                            <Grid item={true}
                                  className="search-index-category-item">
                                <Dropdown id="search-order"
                                          button={
                                              <Button className="search-index-category-filter-button">
                                                  <SortIcon/>
                                              </Button>
                                          }>
                                    <ul className="search-index-category-filter-list">
                                        <li className={classNames({
                                            'search-index-category-filter-selected': this.state.order === 'popularity'
                                        })}>
                                            <a href="#"
                                               onClick={this._handleOrder.bind(this, 'popularity')}>
                                                {I18n.t('js.search.orders.popularity')}
                                            </a>
                                        </li>

                                        <li className="dropdown-divider">
                                            &nbsp;
                                        </li>

                                        {
                                            !!this.props.currentUserId &&
                                            <>
                                                <li className={classNames({
                                                    'search-index-category-filter-selected': this.state.order === 'priority'
                                                })}>
                                                    <a href="#"
                                                       onClick={this._handleOrder.bind(this, 'priority')}>
                                                        {I18n.t('js.search.orders.priority')}
                                                    </a>
                                                </li>

                                                <li className="dropdown-divider">
                                                    &nbsp;
                                                </li>
                                            </>
                                        }

                                        <li className={classNames({
                                            'search-index-category-filter-selected': this.state.order === 'date'
                                        })}>
                                            <a href="#"
                                               onClick={this._handleOrder.bind(this, 'date')}>
                                                {I18n.t('js.search.orders.date')}
                                            </a>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </Grid>

                            <Grid item={true}
                                  className="search-index-category-item">
                                <Dropdown id="search-display"
                                          button={
                                              <Button className="search-index-category-filter-button">
                                                  <DashboardIcon/>
                                              </Button>
                                          }>
                                    <ul className="search-index-category-filter-list">
                                        <li className={classNames({
                                            'search-index-category-filter-selected': this.props.searchDisplay === 'card'
                                        })}>
                                            <a href="#"
                                               onClick={this._handleDisplay.bind(this, 'card')}>
                                                {I18n.t('js.search.display.card')}
                                            </a>
                                        </li>

                                        <li className="dropdown-divider">
                                            &nbsp;
                                        </li>

                                        <li className={classNames({
                                            'search-index-category-filter-selected': this.props.searchDisplay === 'grid'
                                        })}>
                                            <a href="#"
                                               onClick={this._handleDisplay.bind(this, 'grid')}>
                                                {I18n.t('js.search.display.grid')}
                                            </a>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </Grid>

                            {
                                !!this.props.currentUserId &&
                                <Grid item={true}
                                      className="search-index-category-item">
                                    <Button className="search-index-category-filter-button"
                                            onClick={this.props.onSettingsClick.bind(this, 2)}>
                                        <SettingsIcon/>
                                    </Button>
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </Hidden>
            </Grid>
        );
    }
}
