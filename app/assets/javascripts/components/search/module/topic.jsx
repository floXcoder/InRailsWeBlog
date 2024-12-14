import React from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import Chip from '@mui/material/Chip';

import I18n from '@js/modules/translations';

import {
    topicArticlesPath
} from '@js/constants/routesHelper';

import {
    spyTrackClick
} from '@js/actions/metricsActions';


export default class SearchTopicModule extends React.Component {
    static propTypes = {
        topics: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
    }

    _renderTopicItem = (topic) => {
        return (
            <Chip key={topic.id}
                  className="search-module-topic"
                  color="primary"
                  variant="outlined"
                  label={
                      <Link className="search-module-tag-link"
                            to={topicArticlesPath(topic.userSlug, topic.slug)}
                            onClick={spyTrackClick.bind(null, 'topic', topic.id, topic.slug, topic.userId, topic.name, null)}>
                          {topic.name}
                      </Link>
                  }/>
        );
    };

    render() {
        if (this.props.topics.length === 0) {
            return null;
        }

        return (
            <div className="search-module-category">
                <h2 className="search-module-category-name">
                    {I18n.t('js.search.module.topics.title')}
                </h2>

                <div>
                    {this.props.topics.map(this._renderTopicItem.bind(this))}
                </div>
            </div>
        );
    }
}
