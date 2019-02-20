'use strict';

import {
    hot
} from 'react-hot-loader';

import AssignmentIcon from '@material-ui/icons/Assignment';

import {
    getArticles
} from '../../../../selectors';

import ArticleSummaryDisplay from '../summary';

export default @connect((state) => ({
    articles: getArticles(state),
    articleDisplayMode: state.uiState.articleDisplayMode
}))
@hot(module)
class ArticleTimelineMode extends React.Component {
    static propTypes = {
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from connect
        articles: PropTypes.array,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="timeline-container">
                <ul className="timeline">
                    {
                        this.props.articles.map((article, index) => (
                            <li key={index}
                                className={index % 2 === 0 ? 'timeline-item' : 'timeline-item timeline-inverted'}>
                                <div className="timeline-icon">
                                    <AssignmentIcon/>
                                </div>

                                <ArticleSummaryDisplay article={article}
                                                       className={classNames('timeline-panel', {
                                                           'timeline-panel-inverted': index % 2 === 0
                                                       })}
                                                       onEnter={this.props.onEnter}
                                                       onExit={this.props.onExit}/>
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}
