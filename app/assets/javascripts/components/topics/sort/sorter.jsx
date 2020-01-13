'use strict';

import {
    Link
} from 'react-router-dom';

import Button from '@material-ui/core/Button';

import arrayMove from 'array-move';

import {
    SortableContainer,
    SortableElement
} from 'react-sortable-hoc';

import {
    rootPath
} from '../../../constants/routesHelper';

import TopicCardSort from './card';

const SortableItem = SortableElement(({classes, topic}) => (
        <TopicCardSort classes={classes}
                       topic={topic}/>
    )
);

const SortableList = SortableContainer(({classes, topics}) => (
        <div className={classes.sortingItems}>
            {
                topics.map((topic, i) => (
                    <SortableItem key={i}
                                  index={i}
                                  classes={classes}
                                  topic={topic}/>
                ))
            }
        </div>
    )
);

export default class TopicSorter extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        // Topics must already be sorted by priority
        topics: PropTypes.array.isRequired,
        updateTopicPriority: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    state = {
        topics: this.props.topics
    };

    _handleSortEndProduct = ({oldIndex, newIndex}) => {
        this.setState({
            topics: arrayMove(this.state.topics, oldIndex, newIndex)
        });
    };

    _handleSavePriority = (event) => {
        event.preventDefault();

        this.props.updateTopicPriority(this.state.topics.map((topic) => topic['id']));
    };

    render() {
        return (
            <div className={this.props.classes.sorting}>
                <SortableList classes={this.props.classes}
                              topics={this.state.topics}
                              useWindowAsScrollContainer={true}
                              onSortEnd={this._handleSortEndProduct}/>

                <div className="row">
                    <div className="col s12 m6 center-align">
                        <Button color="default"
                                variant="outlined"
                                size="small"
                                component={Link}
                                to={rootPath()}>
                            {I18n.t('js.helpers.buttons.cancel')}
                        </Button>
                    </div>

                    <div className="col s12 m6 center-align">
                        <Button color="primary"
                                variant="outlined"
                                onClick={this._handleSavePriority}>
                            {I18n.t('js.helpers.buttons.apply')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
