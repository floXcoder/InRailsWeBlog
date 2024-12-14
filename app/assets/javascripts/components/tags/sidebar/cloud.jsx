import PropTypes from 'prop-types';

import {Link} from 'react-router';

import classNames from 'classnames';

import Chip from '@mui/material/Chip';

import {taggedTopicArticlesPath} from '@js/constants/routesHelper';

import Scrollbar from '@js/components/theme/scrollbar';


function TagSidebarCloud(props) {
    return (
        <div className="tag-sidebar-cloud-list">
            <Scrollbar>
                {
                    props.currentUserTopics.map((topic) => (
                        <div key={topic.id}>
                            <h3 className="tag-sidebar-cloud-topic">
                                {topic.name}
                            </h3>

                            {
                                props.tags.filter((tag) => tag.topicIds.includes(topic.id))
                                    .map((tag) => (
                                        <Chip key={`${topic.id}-${tag.id}`}
                                              className={classNames('tag-sidebar-cloud-tag', {
                                                  'tag-sidebar-selected-label': props.currentTagSlug === tag.slug
                                              })}
                                              label={tag.name}
                                              color="primary"
                                              variant="outlined"
                                              component={Link}
                                              to={taggedTopicArticlesPath(props.currentUserSlug, topic.slug, tag.slug)}
                                              onClick={props.onTagClick.bind(this, tag.id, tag.name, tag.slug)}/>
                                    ))
                            }
                        </div>
                    ))
                }
            </Scrollbar>
        </div>
    );
}

TagSidebarCloud.propTypes = {
    currentUserSlug: PropTypes.string.isRequired,
    currentUserTopics: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
    onTagClick: PropTypes.func.isRequired,
    currentTagSlug: PropTypes.string
};

export default TagSidebarCloud;
