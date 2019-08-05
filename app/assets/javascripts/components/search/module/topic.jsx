'use strict';

import {
    Link
} from 'react-router-dom';

import Chip from '@material-ui/core/Chip';

export default class SearchTopicModule extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        topics: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
    }

    _renderTopicItem = (topic) => {
        return (
            <Chip key={topic.id}
                  className={classNames(this.props.classes.topic)}
                  label={topic.name}
                  color="primary"
                  variant="outlined"
                  component={Link}
                  to={`/tagged/${topic.slug}`}/>
        );
    };

    render() {
        if(this.props.topics.length === 0) {
            return null;
        }

        return (
            <div className={this.props.classes.category}>
                <h2 className={this.props.classes.categoryName}>
                    {I18n.t('js.search.module.topics.title')}
                </h2>

                <div>
                    {this.props.topics.map(this._renderTopicItem.bind(this))}
                </div>
            </div>
        );
    }
}
