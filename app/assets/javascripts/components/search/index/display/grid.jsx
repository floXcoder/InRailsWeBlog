'use strict';

import {
    hot
} from 'react-hot-loader';

import MasonryWrapper from '../../../theme/masonry';

import ArticleGridDisplay from '../articles/grid';

const ArticleMasonry = MasonryWrapper(ArticleGridDisplay);

export default @hot(module)
class ArticleGridMode extends React.Component {
    static propTypes = {
        children: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ArticleMasonry type="article"
                            elements={this.props.children}
                            topOffset={40}
                            hasColumnButtons={false}
                            columnCount={2}
                            hasExposedMode={false}
                            isActive={true}
                            isPaginated={false}/>
        );
    }
}
