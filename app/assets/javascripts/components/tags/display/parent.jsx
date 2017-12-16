'use strict';

import {
    NavLink
} from 'react-router-dom';

import ChildTag from './child';

export default class ParentTag extends React.PureComponent {
    static propTypes = {
        tag: PropTypes.object.isRequired,
        isFiltering: PropTypes.bool
    };

    static defaultProps = {
        isFiltering: false
    };

    state = {
        isExpanded: false
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            isExpanded: nextProps.isFiltering
        });
    }

    _handleTagClick = () => {
        if (!this.state.isExpanded) {
            this.setState({
                isExpanded: !this.state.isExpanded
            });
        }
    };

    _handleTagIconClick = (event) => {
        event.preventDefault();

        this.setState({
            isExpanded: !this.state.isExpanded
        });
    };

    render() {
        const hasChild = !$.isEmpty(this.props.tag.children);

        return (
            <div className="tag-parent">
                {
                    hasChild
                        ?
                        <i className="material-icons tag-parent-icon"
                           onClick={this._handleTagIconClick}>
                            {this.state.isExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
                        </i>
                        :
                        <div className="tag-parent-icon">
                            &nbsp;
                        </div>
                }

                <NavLink className="tag-parent-name"
                         to={`/article/tags/${this.props.tag.slug}`}
                         onClick={this._handleTagClick}>
                    {this.props.tag.name}
                </NavLink>

                <div className="tag-parent-children">
                    {
                        this.state.isExpanded &&
                        this.props.tag.children.map((tag, i) => (
                            <ChildTag key={i}
                                      tag={tag}
                                      parentTagSlug={this.props.tag.slug}/>
                        ))
                    }
                </div>
            </div>
        );
    };
}
