'use strict';

import IconButton from '@material-ui/core/IconButton';

import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';

import ArticleSortMenu from '../sort/dropdown';
// import ArticleFilterMenu from '../filter/dropdown';

export default class ArticleOrderDisplay extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        onMinimized: PropTypes.func.isRequired,
        onOrderChange: PropTypes.func.isRequired,
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string,
        articleOrderMode: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.classes.order}>
                <ArticleSortMenu currentUserSlug={this.props.currentUserSlug}
                                 currentUserTopicSlug={this.props.currentUserTopicSlug}
                                 currentOrder={this.props.articleOrderMode}
                                 onOrderChange={this.props.onOrderChange}/>

                {
                    // this.props.currentUserId &&
                    // <ArticleFilterMenu/>
                }

                <IconButton aria-label="Minimize all"
                            onClick={this.props.onMinimized}>
                    <VerticalAlignBottomIcon className={this.props.classes.button}/>
                </IconButton>
            </div>
        );
    }
}
