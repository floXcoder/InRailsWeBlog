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

    render() {
        return (
            <div>
                {
                    this.props.tags.map((tag, i) => (
                        <ParentTag key={i}
                                   tag={tag}
                                   isFiltering={this.props.isFiltering}/>
                    ))
                }
            </div>
        );
    }
}
