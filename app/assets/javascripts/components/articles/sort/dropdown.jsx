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

const sortOptions = [
    'priority_desc',
    'tag_asc',
    'updated_desc',
    'updated_asc'
];

// Managed by article index to update current user preference
export default @withStyles(styles)
class ArticleSortMenu extends React.Component {
    static propTypes = {
        onOrderChange: PropTypes.func.isRequired,
        currentOrder: PropTypes.string,
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string,
        // from styles
        classes: PropTypes.object
    };

    state = {
        anchorEl: null,
        selectedIndex: sortOptions.findIndex((option) => option === this.props.currentOrder)
    };

    _handleClickListItem = event => {
        this.setState({
            anchorEl: event.currentTarget
        });
    };

    _handleMenuItemClick = (index, event) => {
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
        let options = sortOptions.map((orderOption) => (
            <Link key={orderOption}
                  className={this.props.classes.buttonLink}
                  to={`/users/${this.props.currentUserSlug}/topics/${this.props.currentUserTopicSlug}/order/${orderOption}`}
                  onClick={this.props.onOrderChange.bind(this, orderOption)}>
                {I18n.t(`js.article.sort.order.${orderOption}`)}
            </Link>
        ));

        if (this.props.currentUserSlug && this.props.currentUserTopicSlug) {
            options.push(
                <Link key={4}
                      to={`/users/${this.props.currentUserSlug}/topics/${this.props.currentUserTopicSlug}/sort`}>
                    {I18n.t('js.article.sort.link')}
                </Link>
            );
        }

        return (
            <>
                <Button className={this.props.classes.button}
                        variant="text"
                        onClick={this._handleClickListItem}>
                    {I18n.t('js.article.sort.title')}
                    <span className={this.props.classes.buttonInfo}>({I18n.t(`js.article.sort.order.${this.props.currentOrder || 'priority'}`)})</span>
                </Button>

                <Menu anchorEl={this.state.anchorEl}
                      open={Boolean(this.state.anchorEl)}
                      onClose={this._handleClose}>
                    {
                        options.map((option, index) => (
                            <MenuItem key={index}
                                      selected={index === this.state.selectedIndex}
                                      onClick={this._handleMenuItemClick.bind(this, index)}>
                                {option}
                            </MenuItem>
                        ))
                    }
                </Menu>
            </>
        );
    }
}
