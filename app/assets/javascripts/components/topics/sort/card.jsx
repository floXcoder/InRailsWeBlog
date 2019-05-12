'use strict';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const TopicCardSort = ({classes, topic}) => (
    <div className={classes.sortingItem}>
        <Card component="article"
              className={classes.card}>
            <CardHeader classes={{
                title: classes.cardTitle
            }}
                        title={topic.name}/>

            {
                topic.description &&
                <CardContent classes={{
                    root: classes.cardContent
                }}>
                    <div className="normalized-content ellipsis-content"
                         dangerouslySetInnerHTML={{__html: topic.description}}/>
                </CardContent>
            }
        </Card>
    </div>
);

TopicCardSort.propTypes = {
    classes: PropTypes.object.isRequired,
    topic: PropTypes.object.isRequired
};

export default React.memo(TopicCardSort);
