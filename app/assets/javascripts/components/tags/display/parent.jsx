'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

import ChildTag from './child';

export default class ParentTag extends React.Component {
    static propTypes = {
        tag: PropTypes.object.isRequired,
        onTagClick: PropTypes.func.isRequired,
        isFiltering: PropTypes.bool
    };

    static defaultProps = {
        isFiltering: false
    };

    state = {
        isExpanded: false
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.isFiltering !== nextProps.isFiltering) {
            this.setState({
                isExpanded: nextProps.isFiltering
            });
        }
    }

    _handleTagClick = (tagId, parent) => {
        spyTrackClick('tag', tagId);

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
        const currentUrl = window.location.pathname;

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
                    'tag-selected': currentUrl === `/tagged/${this.props.tag.slug}`
                })}
                      to={`/tagged/${this.props.tag.slug}`}
                      onClick={this._handleTagClick.bind(this, this.props.tag.id, true)}>
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
                                      onTagClick={this._handleTagClick.bind(this, tag.id, false)}/>
                        ))
                    }
                </div>
            </div>
        );
    };
}
