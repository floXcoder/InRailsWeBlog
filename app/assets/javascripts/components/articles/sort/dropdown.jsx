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

// Managed by article index
export default @withStyles(styles)

class ArticleSortMenu extends React.Component {
    static propTypes = {
        onOrderChange: PropTypes.func.isRequired,
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string,
        currentOrder: PropTypes.string,
        // from styles
        classes: PropTypes.object
    };

    state = {
        anchorEl: null,
        selectedIndex: 1,
    };

    handleClickListItem = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleMenuItemClick = (event, index) => {
        this.setState({selectedIndex: index, anchorEl: null});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    render() {
        const {anchorEl} = this.state;

        let options = [
            <Link key={1}
                  className={this.props.classes.buttonLink}
                  to={{search: 'order=priority_desc'}}
                  onClick={this.props.onOrderChange.bind(this, 'priority_desc')}>
                {I18n.t('js.article.sort.order.priority')}
            </Link>,
            <Link key={2}
                  className={this.props.classes.buttonLink}
                  to={{search: 'order=tag_asc'}}
                  onClick={this.props.onOrderChange.bind(this, 'tag_asc')}>
                {I18n.t('js.article.sort.order.tag')}
            </Link>,
            <Link key={3}
                  className={this.props.classes.buttonLink}
                  to={{search: 'order=updated_desc'}}
                  onClick={this.props.onOrderChange.bind(this, 'updated_desc')}>
                {I18n.t('js.article.sort.order.date_desc')}
            </Link>,
            <Link key={4}
                  className={this.props.classes.buttonLink}
                  to={{search: 'order=updated_asc'}}
                  onClick={this.props.onOrderChange.bind(this, 'updated_asc')}>
                {I18n.t('js.article.sort.order.date_asc')}
            </Link>
        ];

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
                        variant="outlined"
                        onClick={this.handleClickListItem}>
                    {I18n.t('js.article.sort.title')}
                </Button>

                <Menu anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={this.handleClose}>
                    {
                        options.map((option, index) => (
                            <MenuItem key={index}
                                      selected={index === this.state.selectedIndex}
                                      onClick={event => this.handleMenuItemClick(event, index)}>
                                {option}
                            </MenuItem>
                        ))
                    }
                </Menu>
            </>
        );
    }
}
