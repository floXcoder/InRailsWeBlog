'use strict';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

function TopicCardSort({topic}) {
    return (
        <div className="topic-sort-sorting-item">
            <Card component="article"
                  className="topic-sort-card">
                <CardHeader classes={{
                    title: 'topic-sort-card-title'
                }}
                            title={topic.name}/>

                {
                    !!topic.description &&
                    <CardContent classes={{
                        root: 'topic-sort-card-content'
                    }}>
                        <div className="normalized-content ellipsis-content"
                             dangerouslySetInnerHTML={{__html: topic.description}}/>
                    </CardContent>
                }
            </Card>
        </div>
    );
}

TopicCardSort.propTypes = {
    topic: PropTypes.object.isRequired
};

export default React.memo(TopicCardSort);
