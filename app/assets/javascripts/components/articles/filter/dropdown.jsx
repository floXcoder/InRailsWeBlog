'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';

import styles from '../../../../jss/article/filter';

export default @withStyles(styles)

class ArticleFilterMenu extends React.Component {
    static propTypes = {
        // from styles
        classes: PropTypes.object
    };

    state = {
        anchorEl: null,
        selectedIndex: 1,
    };

    _handleClickListItem = event => {
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
        let options = [
            <Link key={1}
                  className={this.props.classes.buttonLink}
                  to={{search: 'bookmarked=true'}}>
                {I18n.t('js.article.filter.filters.bookmark')}
            </Link>,
            <Link key={2}
                  className={this.props.classes.buttonLink}
                  to={{search: 'draft=true'}}>
                {I18n.t('js.article.filter.filters.draft')}
            </Link>
        ];

        return (
            <>
                <Button className={this.props.classes.button}
                        variant="outlined"
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
                                      onClick={event => this._handleMenuItemClick(event, index)}>
                                {option}
                            </MenuItem>
                        ))
                    }
                </Menu>
            </>
        );
    }
}
