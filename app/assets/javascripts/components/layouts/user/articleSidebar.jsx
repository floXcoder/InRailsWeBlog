import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

import ArticleSidebar from '@js/components/articles/sidebar';


export default class ArticleSidebarLayout extends React.PureComponent {
    static propTypes = {
        parentTagSlug: PropTypes.string,
        isArticle: PropTypes.bool
    };

    static defaultProps = {
        isArticle: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        isExpanded: !this.props.isArticle
    };

    _handleDrawerOver = (event) => {
        if (!this.props.isArticle) {
            return;
        }

        event.preventDefault();

        if (!this.state.isExpanded) {
            this.setState({
                isExpanded: true
            });
        }
    };

    _handleDrawerOut = (event) => {
        if (!this.props.isArticle) {
            return;
        }

        event.preventDefault();

        if (this.state.isExpanded) {
            this.setState({
                isExpanded: false
            });
        }
    };

    render() {
        return (
            <Drawer anchor="right"
                    variant="permanent"
                    classes={{
                        paper: classNames('search-sidebar-drawer-paper', 'search-sidebar-drawer-paper-overflow', {
                            'search-sidebar-drawer-paper-borderless': !this.props.isArticle,
                            'search-sidebar-drawer-paper-close': !this.state.isExpanded
                        })
                    }}
                    open={this.state.isExpanded}
                    onMouseOver={this._handleDrawerOver}
                    onMouseLeave={this._handleDrawerOut}>
                <div>
                    {
                        !!this.props.isArticle &&
                        <IconButton component="span"
                                    size="large">
                            {
                                this.state.isExpanded
                                    ?
                                    <LastPageIcon/>
                                    :
                                    <FirstPageIcon/>
                            }
                        </IconButton>
                    }
                </div>

                <ArticleSidebar isOpen={this.state.isExpanded}
                                parentTagSlug={this.props.parentTagSlug}
                                isArticle={this.props.isArticle}/>
            </Drawer>
        );
    }
}
