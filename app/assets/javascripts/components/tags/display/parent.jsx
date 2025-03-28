import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {
    Link
} from 'react-router';

import classNames from 'classnames';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import * as Utils from '@js/modules/utils';

import {
    taggedArticlesPath,
    taggedTopicArticlesPath
} from '@js/constants/routesHelper';

import {
    getCurrentTagSlugs
} from '@js/selectors/tagSelectors';

import ChildTag from '@js/components/tags/display/child';


class ParentTag extends React.PureComponent {
    static propTypes = {
        tag: PropTypes.object.isRequired,
        onTagClick: PropTypes.func.isRequired,
        currentTagSlug: PropTypes.string,
        currentChildTagSlug: PropTypes.string,
        isFiltering: PropTypes.bool,
        // from connect
        currentTagSlugs: PropTypes.array,
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string
    };

    static defaultProps = {
        isFiltering: false
    };

    state = {
        isFiltering: this.props.isFiltering,
        isExpanded: false
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.isFiltering !== nextProps.isFiltering) {
            return {
                ...prevState,
                isExpanded: nextProps.isFiltering
            };
        }

        return null;
    }

    _handleTagClick = (tagId, tagName, tagSlug, tagUserId, parent) => {
        this.props.onTagClick(tagId, tagSlug, tagUserId, tagName);

        if (parent) {
            if (!this.state.isExpanded) {
                this.setState({
                    isExpanded: !this.state.isExpanded
                });
            }
        }
    };

    _handleTagIconClick = (event) => {
        event.preventDefault();

        this.setState({
            isExpanded: !this.state.isExpanded
        });
    };

    render() {
        const hasChild = Utils.isPresent(this.props.tag.children);

        return (
            <>
                <ListItemButton component={Link}
                                to={
                                    this.props.currentUserSlug && this.props.currentUserTopicSlug
                                        ?
                                        taggedTopicArticlesPath(this.props.currentUserSlug, this.props.currentUserTopicSlug, this.props.tag.slug)
                                        :
                                        taggedArticlesPath(this.props.tag.slug)
                                }
                                onClick={this._handleTagClick.bind(this, this.props.tag.id, this.props.tag.slug, this.props.tag.userId, this.props.tag.name, true)}>
                    <ListItemText classes={{
                        primary: classNames('tag-sidebar-label', {
                            'tag-sidebar-selected-label': this.props.currentTagSlug ? this.props.currentTagSlug === this.props.tag.slug : this.props.currentTagSlugs.includes(this.props.tag.slug)
                        })
                    }}>
                        {this.props.tag.name}
                    </ListItemText>

                    {
                        !!hasChild && (
                            this.state.isExpanded
                                ?
                                <ExpandLess className="tag-sidebar-expand-icon"
                                            color="secondary"
                                            onClick={this._handleTagIconClick}/>
                                :
                                <ExpandMore className="tag-sidebar-expand-icon"
                                            color="secondary"
                                            onClick={this._handleTagIconClick}/>
                        )
                    }
                </ListItemButton>

                {
                    !!hasChild &&
                    <Collapse in={this.state.isExpanded}
                              timeout="auto"
                              unmountOnExit={true}>
                        <List component="div"
                              disablePadding={true}
                              dense={true}>
                            {
                                this.props.tag.children.map((tag, i) => (
                                    <ChildTag key={i}
                                              tag={tag}
                                              parentTagSlug={this.props.tag.slug}
                                              currentChildTagSlug={this.props.currentChildTagSlug}
                                              currentTagSlugs={this.props.currentTagSlugs}
                                              currentUserSlug={this.props.currentUserSlug}
                                              currentUserTopicSlug={this.props.currentUserTopicSlug}
                                              onTagClick={this._handleTagClick.bind(this, tag.id, tag.name, tag.userId, tag.slug, false)}/>
                                ))
                            }
                        </List>
                    </Collapse>
                }
            </>
        );
    }
}

export default connect((state) => ({
    currentTagSlugs: getCurrentTagSlugs(state),
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug
}))(ParentTag);