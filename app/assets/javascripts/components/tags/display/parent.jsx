'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

import {
    getCurrentTagSlugs
} from '../../../selectors';

import ChildTag from './child';

@connect((state) => ({
    currentTagSlugs: getCurrentTagSlugs(state)
}))
export default class ParentTag extends React.Component {
    static propTypes = {
        tag: PropTypes.object.isRequired,
        onTagClick: PropTypes.func.isRequired,
        isFiltering: PropTypes.bool,
        // From connect
        currentTagSlugs: PropTypes.array
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
        spyTrackClick('tag', tagId, tagSlug, tagName);

        if (parent) {
            if (!this.state.isExpanded) {
                this.setState({
                    isExpanded: !this.state.isExpanded
                });
            }
        }

        this.props.onTagClick(tagId);
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
            <div className="tag-parent">
                {
                    hasChild
                        ?
                        <span className="material-icons tag-parent-icon"
                              data-icon={this.state.isExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
                              aria-hidden="true"
                              onClick={this._handleTagIconClick}/>
                        :
                        <div className="tag-parent-icon">
                            &nbsp;
                        </div>
                }

                <Link className={classNames('tag-parent-name', {
                    'tag-selected': this.props.currentTagSlugs.includes(this.props.tag.slug)
                })}
                      to={`/tagged/${this.props.tag.slug}`}
                      onClick={this._handleTagClick.bind(this, this.props.tag.id, this.props.tag.name, this.props.tag.slug, true)}>
                    {this.props.tag.name}
                </Link>


                <div className={classNames('tag-parent-children', {
                    'tag-parent-children-display': this.state.isExpanded
                })}>
                    {
                        this.props.tag.children.map((tag, i) => (
                            <ChildTag key={i}
                                      tag={tag}
                                      parentTagSlug={this.props.tag.slug}
                                      isExpanded={this.state.isExpanded}
                                      currentTagSlugs={this.props.currentTagSlugs}
                                      onTagClick={this._handleTagClick.bind(this, tag.id, tag.name, tag.slug, false)}/>
                        ))
                    }
                </div>
            </div>
        );
    };
}
