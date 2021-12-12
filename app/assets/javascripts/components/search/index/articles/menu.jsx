'use strict';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import TextField from '@material-ui/core/TextField';

import SettingsIcon from '@material-ui/icons/Settings';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SortIcon from '@material-ui/icons/Sort';
import FindInPageIcon from '@material-ui/icons/FindInPage';

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
            <Grid className="search-index-categoryHeader"
                  container={true}
                  spacing={4}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end">
                <Grid item={true}
                      className="search-index-categoryItem">
                    <h2 className="search-index-categoryTitle">
                        {I18n.t('js.search.index.articles.title')}
                    </h2>

                    <span className="search-index-categoryCount">
                        {`(${I18n.t('js.search.index.results', {count: this.props.articlesCount})})`}
                    </span>
                </Grid>

                <Hidden smDown={true}>
                    <Grid item={true}>
                        <Grid container={true}
                              spacing={2}
                              direction="row"
                              justifyContent="flex-end"
                              alignItems="flex-end">
                            {
                                this.props.currentUserId &&
                                <Grid item={true}
                                      className="search-index-categoryItem">
                                    <Dropdown position="bottom right"
                                              isClosingOnInsideClick={false}
                                              hasArrow={true}
                                              tooltip={I18n.t('js.search.scrap.field')}
                                              button={
                                                  <Button className="search-index-categoryFilterButton">
                                                      <FindInPageIcon/>
                                                  </Button>
                                              }>
                                        <form noValidate={true}
                                              onSubmit={this.props.onURLSearchSubmit}>
                                            <ul className="search-index-categoryFilterList">
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
                                                        <Button className="search-index-categoryFilterButton"
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
                                  className="search-index-categoryItem">
                                <Dropdown position="bottom right"
                                          isClosingOnInsideClick={true}
                                          hasArrow={true}
                                          button={
                                              <Button className="search-index-categoryFilterButton">
                                                  <SortIcon/>
                                              </Button>
                                          }>
                                    <ul className="search-index-categoryFilterList">
                                        <li className={classNames({
                                            'search-index-categoryFilterSelected': this.state.order === 'popularity'
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
                                            this.props.currentUserId &&
                                            <>
                                                <li className={classNames({
                                                    'search-index-categoryFilterSelected': this.state.order === 'priority'
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
                                            'search-index-categoryFilterSelected': this.state.order === 'date'
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
                                  className="search-index-categoryItem">
                                <Dropdown position="bottom right"
                                          isClosingOnInsideClick={true}
                                          hasArrow={true}
                                          button={
                                              <Button className="search-index-categoryFilterButton">
                                                  <DashboardIcon/>
                                              </Button>
                                          }>
                                    <ul className="search-index-categoryFilterList">
                                        <li className={classNames({
                                            'search-index-categoryFilterSelected': this.props.searchDisplay === 'card'
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
                                            'search-index-categoryFilterSelected': this.props.searchDisplay === 'grid'
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
                                this.props.currentUserId &&
                                <Grid item={true}
                                      className="search-index-categoryItem">
                                    <Button className="search-index-categoryFilterButton"
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
