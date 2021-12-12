'use strict';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

var TopicCardSort = function ({topic}) {
  return <div className="topic-sort-sortingItem">
        <Card component="article"
              className="topic-sort-card">
            <CardHeader classes={{
                title: 'topic-sort-cardTitle'
            }}
                        title={topic.name}/>

            {
                topic.description &&
                <CardContent classes={{
                    root: 'topic-sort-cardContent'
                }}>
                    <div className="normalized-content ellipsis-content"
                         dangerouslySetInnerHTML={{__html: topic.description}}/>
                </CardContent>
            }
        </Card>
         </div>;
};

TopicCardSort.propTypes = {
    topic: PropTypes.object.isRequired
};

export default React.memo(TopicCardSort);
