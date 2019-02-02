'use strict';

import List from '@material-ui/core/List';

import ParentTag from './parent';

export default class TagRelationshipDisplay extends React.Component {
    static propTypes = {
        tags: PropTypes.array.isRequired,
        currentTagSlug: PropTypes.string,
        currentChildTagSlug: PropTypes.string,
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
            <List dense={true}>
                {
                    this.props.tags.map((tag, i) => (
                        <ParentTag key={i}
                                   tag={tag}
                                   currentTagSlug={this.props.currentTagSlug}
                                   currentChildTagSlug={this.props.currentChildTagSlug}
                                   isFiltering={this.props.isFiltering}/>
                    ))
                }
            </List>
        );
    }
}
