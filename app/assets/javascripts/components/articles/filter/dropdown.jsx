'use strict';

import {
    Link
} from 'react-router-dom';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';


export default class ArticleFilterMenu extends React.Component {
    state = {
        anchorEl: null,
        selectedIndex: 0
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
        const options = [
            <Link key={1}
                  className="article-dropdown-button-link"
                  to={{search: 'bookmarked=true'}}>
                {I18n.t('js.article.filter.filters.bookmark')}
            </Link>,
            <Link key={2}
                  className="article-dropdown-button-link"
                  to={{search: 'draft=true'}}>
                {I18n.t('js.article.filter.filters.draft')}
            </Link>
        ];

        return (
            <>
                <Button className="article-dropdown-button"
                        variant="text"
                        onClick={this._handleClickListItem}>
                    {I18n.t('js.article.filter.title')}
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
