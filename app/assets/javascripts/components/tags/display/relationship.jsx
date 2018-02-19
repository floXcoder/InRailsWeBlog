'use strict';

import ParentTag from './parent';

export default class TagRelationshipDisplay extends React.Component {
    static propTypes = {
        tags: PropTypes.array.isRequired,
        isFiltering: PropTypes.bool
    };

    static defaultProps = {
        isFiltering: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        reloadLink: false
    };

    _handleTagClick = (value) => {
        this.setState({
            reloadLink: !this.state.reloadLink
        });
    };

    render() {
        return (
            <div>
                {
                    this.props.tags.map((tag, i) => (
                        <ParentTag key={i}
                                   tag={tag}
                                   isFiltering={this.props.isFiltering}
                                   onTagClick={this._handleTagClick}/>
                    ))
                }
            </div>
        );
    }
}
