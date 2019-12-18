'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import {
    getCurrentTagSlugs
} from '../../../selectors';

import ChildTag from './child';

import styles from '../../../../jss/tag/sidebar';

export default @connect((state) => ({
    currentTagSlugs: getCurrentTagSlugs(state)
}))
@withStyles(styles)
class ParentTag extends React.Component {
    static propTypes = {
        tag: PropTypes.object.isRequired,
        onTagClick: PropTypes.func.isRequired,
        currentTagSlug: PropTypes.string,
        currentChildTagSlug: PropTypes.string,
        isFiltering: PropTypes.bool,
        // from connect
        currentTagSlugs: PropTypes.array,
        // from styles
        classes: PropTypes.object
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

    _handleTagClick = (tagId, tagName, tagSlug, parent) => {
        this.props.onTagClick(tagId, tagSlug, tagName);

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
        const hasChild = !Utils.isEmpty(this.props.tag.children);

        return (
            <>
                <ListItem button={true}
                          component={Link}
                          to={`/tagged/${this.props.tag.slug}`}
                          onClick={this._handleTagClick.bind(this, this.props.tag.id, this.props.tag.name, this.props.tag.slug, true)}>
                    <ListItemText classes={{
                        primary: classNames(this.props.classes.label, {
                            [this.props.classes.selectedLabel]: this.props.currentTagSlug ? this.props.currentTagSlug === this.props.tag.slug : this.props.currentTagSlugs.includes(this.props.tag.slug)
                        })
                    }}>
                        {this.props.tag.name}
                    </ListItemText>

                    {
                        hasChild && (
                            this.state.isExpanded
                                ?
                                <ExpandLess className={this.props.classes.expandIcon}
                                            onClick={this._handleTagIconClick}/>
                                :
                                <ExpandMore className={this.props.classes.expandIcon}
                                            onClick={this._handleTagIconClick}/>
                        )
                    }
                </ListItem>

                {
                    hasChild &&
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
                                              isExpanded={this.state.isExpanded}
                                              currentChildTagSlug={this.props.currentChildTagSlug}
                                              currentTagSlugs={this.props.currentTagSlugs}
                                              classes={this.props.classes}
                                              onTagClick={this._handleTagClick.bind(this, tag.id, tag.name, tag.slug, false)}/>
                                ))
                            }
                        </List>
                    </Collapse>
                }
            </>
        );
    };
}
