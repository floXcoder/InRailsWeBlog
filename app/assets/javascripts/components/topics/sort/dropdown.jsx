import React from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';

import I18n from '@js/modules/translations';

import {
    sortTopicArticlesPath
} from '@js/constants/routesHelper';

const sortOptions = [
    'updated_desc',
    'updated_asc',
    'priority_desc',
    'tag_asc'
];


// Managed by article index to update current user preference
export default class ArticleSortMenu extends React.Component {
    static propTypes = {
        onOrderChange: PropTypes.func.isRequired,
        currentOrder: PropTypes.string,
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string
    };

    state = {
        anchorEl: null,
        selectedIndex: sortOptions.findIndex((option) => option === this.props.currentOrder)
    };

    _handleClickListItem = (event) => {
        this.setState({
            anchorEl: event.currentTarget
        });
    };

    _handleMenuItemClick = (event, index) => {
        this.setState({
            selectedIndex: index,
            anchorEl: null
        });
    };

    _handleClose = () => {
        this.setState({
            anchorEl: null
        });
    };

    render() {
        const options = sortOptions.map((option) => (
            <Link key={option}
                  className="article-dropdown-button-link"
                  to={{search: `order=${option}`}}
                  onClick={this.props.onOrderChange.bind(this, option)}>
                {I18n.t(`js.article.sort.order.${option}`)}
            </Link>
        ));

        if (this.props.currentUserSlug && this.props.currentUserTopicSlug) {
            options.push(
                <Link key={4}
                      to={sortTopicArticlesPath(this.props.currentUserSlug, this.props.currentUserTopicSlug)}>
                    {I18n.t('js.article.sort.link')}
                </Link>
            );
        }

        return (
            <>
                <Button className="article-dropdown-button"
                        variant="text"
                        onClick={this._handleClickListItem}>
                    {I18n.t('js.article.sort.title')}
                </Button>

                <Menu anchorEl={this.state.anchorEl}
                      open={Boolean(this.state.anchorEl)}
                      onClose={this._handleClose}>
                    {
                        options.map((option, index) => (
                            <MenuItem key={index}
                                      selected={index === this.state.selectedIndex}
                                      onClick={(event) => this._handleMenuItemClick(event, index)}>
                                {option}
                            </MenuItem>
                        ))
                    }
                </Menu>
            </>
        );
    }
}
