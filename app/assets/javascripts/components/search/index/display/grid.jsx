'use strict';

import {
    hot
} from 'react-hot-loader/root';

import MasonryWrapper from '../../../theme/masonry';

import ArticleGridDisplay from '../articles/grid';

const ArticleMasonry = MasonryWrapper(ArticleGridDisplay);

export default @hot
class ArticleGridModeSearch extends React.Component {
    static propTypes = {
        articles: PropTypes.array.isRequired,
        searchGridColumns: PropTypes.number
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ArticleMasonry type="article"
                            elements={this.props.articles}
                            topOffset={40}
                            hasColumnButtons={false}
                            columnCount={this.props.searchGridColumns}
                            hasExposedMode={false}
                            isActive={true}
                            isPaginated={false}/>
        );
    }
}
