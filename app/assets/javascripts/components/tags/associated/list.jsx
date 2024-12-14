import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

export default class AssociatedTagList extends React.PureComponent {
    static propTypes = {
        tags: PropTypes.array.isRequired,
        onClickTag: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    state = {
        classByTag: {}
    };

    _handleTagClick = (tagId, event) => {
        event.preventDefault();

        const classByTag = this.state.classByTag;
        classByTag[tagId] = !classByTag[tagId];
        this.setState({classByTag: classByTag});

        this.props.onClickTag(tagId, !classByTag[tagId]);
    };

    render() {
        return (
            <div>
                {
                    this.props.tags.map((tag, i) => (
                        <div key={i}
                             className={
                                 classNames(
                                     'article-tag',
                                     {
                                         'tag-inactive': this.state.classByTag[tag.id],
                                         'tag-active': !this.state.classByTag[tag.id]
                                     }
                                 )
                             }
                             onClick={this._handleTagClick.bind(this, tag.id)}>
                            {tag.name}
                        </div>
                    ))
                }
            </div>
        );
    }
}
