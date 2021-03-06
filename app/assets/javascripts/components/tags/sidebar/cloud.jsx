'use strict';

import {
    Link
} from 'react-router-dom';

import Chip from '@material-ui/core/Chip';

import {
    taggedTopicArticlesPath
} from '../../../constants/routesHelper';

import Scrollbar from '../../theme/scrollbar';

export default class TagSidebarCloud extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        currentUserSlug: PropTypes.string.isRequired,
        currentUserTopics: PropTypes.array.isRequired,
        tags: PropTypes.array.isRequired,
        onTagClick: PropTypes.func.isRequired,
        currentTagSlug: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.classes.cloudList}>
                <Scrollbar>
                    {
                        this.props.currentUserTopics.map((topic) => (
                            <div key={topic.id}>
                                <h3 className={this.props.classes.cloudTopic}>
                                    {topic.name}
                                </h3>

                                {
                                    this.props.tags.filter((tag) => tag.topicIds.includes(topic.id)).map((tag) => (
                                        <Chip key={`${topic.id}-${tag.id}`}
                                              className={classNames(this.props.classes.cloudTag, {
                                                  [this.props.classes.selectedLabel]: this.props.currentTagSlug === tag.slug
                                              })}
                                              label={tag.name}
                                              color="primary"
                                              variant="outlined"
                                              component={Link}
                                              to={taggedTopicArticlesPath(this.props.currentUserSlug, topic.slug, tag.slug)}
                                              onClick={this.props.onTagClick.bind(this, tag.id, tag.name, tag.slug)}/>
                                    ))
                                }
                            </div>
                        ))
                    }
                </Scrollbar>
            </div>
        );
    }
}
