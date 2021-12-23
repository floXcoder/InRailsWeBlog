'use strict';

import {
    Link
} from 'react-router-dom';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import {
    orderTopicArticlesPath,
    sortTopicArticlesPath
} from '../../../constants/routesHelper';

const sortOptions = [
    'updated_desc',
    'updated_asc',
    'created_desc',
    'created_asc',
    'tag_asc',
    'priority_desc',
    'default'
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

    static getDerivedStateFromProps(nextProps, prevState) {
        const newSelectedIndex = sortOptions.findIndex((option) => option === nextProps.currentOrder);

        if (nextProps.currentOrder && prevState.selectedIndex !== newSelectedIndex) {
            return {
                selectedIndex: newSelectedIndex
            };
        }

        return null;
    }

    _handleClickListItem = (event) => {
        this.setState({
            anchorEl: event.currentTarget
        });
    };

    _handleMenuItemClick = (index) => {
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
        const options = sortOptions.map((orderOption) => (
            <Link key={orderOption}
                  className="article-dropdown-buttonLink"
                  to={orderTopicArticlesPath(this.props.currentUserSlug, this.props.currentUserTopicSlug, orderOption)}>
                {I18n.t(`js.article.sort.order.${orderOption}`)}
            </Link>
        ));

        return (
            <>
                <Button className="article-dropdown-button"
                        variant="text"
                        onClick={this._handleClickListItem}>
                    {I18n.t('js.article.sort.title')}

                    <span className="article-dropdown-buttonInfo">
                        ({I18n.t(`js.article.sort.order.${this.props.currentOrder || 'updated_desc'}`)})
                    </span>
                </Button>

                <Menu anchorEl={this.state.anchorEl}
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
                              className="article-dropdown-sortLink"
                              to={sortTopicArticlesPath(this.props.currentUserSlug, this.props.currentUserTopicSlug)}>
                            {I18n.t('js.article.sort.link')}
                        </Link>
                    }
                </Menu>
            </>
        );
    }
}
