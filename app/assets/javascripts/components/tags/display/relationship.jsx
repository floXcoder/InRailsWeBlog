'use strict';

import ArticleActions from '../../../actions/articleActions';
import ParentTag from './parent';

export default class TagRelationshipDisplay extends React.Component {
    static propTypes = {
        router: React.PropTypes.object.isRequired,
        tags: React.PropTypes.array,
        isSearching: React.PropTypes.bool
    };

    static defaultProps = {
        tags: [],
        isSearching: false
    };

    constructor(props) {
        super(props);
    }

    // TODO: useless?
    // shouldComponentUpdate(nextProps, nextState) {
    //     return !this.props.tags.isEqualIds(nextProps.tags) || this.props.filterText !== nextProps.filterText;
    // }

    _handleTagClick = (tagId, parentTagSlug, childTagSlug) => {
        // TODO
        // TagStore.onTrackClick(tagId);

        if (!$.isEmpty(childTagSlug)) {
            this.props.router.history.push(`${this.props.router.match.url}/tags/${parentTagSlug}/${childTagSlug}`);
        } else if (!$.isEmpty(parentTagSlug)) {
            this.props.router.history.push(`${this.props.router.match.url}/tags/${parentTagSlug}`);
        }
    };

    render() {
        return (
            <div>
                {
                    this.props.tags.map((tag, i) =>
                        <ParentTag key={i}
                                   tag={tag}
                                   isSearching={this.props.isSearching}
                                   onClickTag={this._handleTagClick}/>
                    )
                }
            </div>
        );
    }
}
