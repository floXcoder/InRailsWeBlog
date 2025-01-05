import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import classNames from 'classnames';

import AssignmentIcon from '@mui/icons-material/Assignment';

import ArticleSummaryDisplay from '@js/components/articles/display/items/summary';


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

export default connect((state) => ({
    articles: state.articleState.articles,
    articleDisplayMode: state.uiState.articleDisplayMode
}))(ArticleTimelineMode);