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
import Divider from '@material-ui/core/Divider';

import {
    orderTopicArticlesPath,
    sortTopicArticlesPath
} from '../../../constants/routesHelper';

import styles from '../../../../jss/article/filter';

const sortOptions = [
    'created_desc',
    'created_asc',
    'tag_asc',
    'priority_desc',
    'default'
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

    static getDerivedStateFromProps(nextProps, prevState) {
        const newSelectedIndex = sortOptions.findIndex((option) => option === nextProps.currentOrder);

        if (nextProps.currentOrder && prevState.selectedIndex !== newSelectedIndex) {
            return {
                selectedIndex: newSelectedIndex
            };
        }

        return null;
    }

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

        this.props.onOrderChange(sortOptions[index]);
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
                  to={orderTopicArticlesPath(this.props.currentUserSlug, this.props.currentUserTopicSlug, orderOption)}>
                {I18n.t(`js.article.sort.order.${orderOption}`)}
            </Link>
        ));

        return (
            <>
                <Button className={this.props.classes.button}
                        variant="text"
                        onClick={this._handleClickListItem}>
                    {I18n.t('js.article.sort.title')}

                    <span className={this.props.classes.buttonInfo}>
                        ({I18n.t(`js.article.sort.order.${this.props.currentOrder || 'priority_desc'}`)})
                    </span>
                </Button>

                <Menu anchorEl={this.state.anchorEl}
                      getContentAnchorEl={null}
                      anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                      }}
                      transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                      }}
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

                    {
                        (this.props.currentUserSlug && this.props.currentUserTopicSlug) &&
                        <Divider className="margin-bottom-10"/>
                    }

                    {
                        (this.props.currentUserSlug && this.props.currentUserTopicSlug) &&
                        <Link key="link"
                              className={this.props.classes.sortLink}
                              to={sortTopicArticlesPath(this.props.currentUserSlug, this.props.currentUserTopicSlug)}>
                            {I18n.t('js.article.sort.link')}
                        </Link>
                    }
                </Menu>
            </>
        );
    }
}
