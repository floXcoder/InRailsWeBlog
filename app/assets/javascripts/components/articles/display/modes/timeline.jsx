'use strict';

import {
    hot
} from 'react-hot-loader/root';

import AssignmentIcon from '@material-ui/icons/Assignment';

import ArticleSummaryDisplay from '../items/summary';

export default @connect((state) => ({
    articles: state.articleState.articles,
    articleDisplayMode: state.uiState.articleDisplayMode
}))
@hot
class ArticleTimelineMode extends React.Component {
    static propTypes = {
        topicVisibility: PropTypes.string,
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

                                <ArticleSummaryDisplay className={classNames('timeline-panel', {
                                                           'timeline-panel-inverted': index % 2 === 0
                                                       })}
                                                       article={article}
                                                       topicVisibility={this.props.topicVisibility}
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
