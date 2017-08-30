'use strict';

import ParentTag from './parent';

export default class TagRelationshipDisplay extends React.Component {
    static propTypes = {
        onTagClick: PropTypes.func.isRequired,
        tags: PropTypes.array,
        isFiltering: PropTypes.bool
    };

    static defaultProps = {
        tags: [],
        isFiltering: false
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {
                    this.props.tags.map((tag, i) => (
                            <ParentTag key={i}
                                       tag={tag}
                                       isFiltering={this.props.isFiltering}
                                       onTagClick={this.props.onTagClick}/>
                        )
                    )
                }
            </div>
        );
    }
}
