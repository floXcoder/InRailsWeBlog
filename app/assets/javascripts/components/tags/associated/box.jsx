'use strict';

import AssociatedTagList from './list';

import Loader from '../../theme/loader';

export default class AssociatedTagBox extends React.Component {
    static propTypes = {
        hasMore: PropTypes.bool
    };

    static defaultProps = {
        hasMore: false
    };

    constructor(props) {
        super(props);

        // if (Utils.isPresent(articleData.articles)) {
        //     let associatedTags = [];
        //
        //     articleData.articles.forEach((article) => {
        //         if (Utils.isPresent(article.tags)) {
        //             associatedTags = associatedTags.concat(article.tags);
        //         }
        //     });
        //
        //     associatedTags = _.uniq(associatedTags, (tag) => tag.id);
        //
        //     this.setState({
        //         associatedTags: associatedTags,
        //         isLoading: false
        //     });
        // }
    }

    _handleTagClick = (tagId, activeTag) => {
    };

    render() {
        return (
            <div className="center-align">
                {
                    this.state.associatedTags &&
                    <AssociatedTagList tags={this.state.associatedTags}
                                       onClickTag={this._handleTagClick}/>
                }

                <div className={classNames({
                    center: this.props.hasMore,
                    hide: !this.props.hasMore
                })}>
                    <Loader/>
                </div>
            </div>
        );
    }
}
