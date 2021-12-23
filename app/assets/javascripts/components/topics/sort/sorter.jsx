'use strict';

import {
    Link
} from 'react-router-dom';

import Button from '@mui/material/Button';

import {arrayMoveImmutable} from 'array-move';

import {
    SortableContainer,
    SortableElement
} from 'react-sortable-hoc';

import {
    rootPath
} from '../../../constants/routesHelper';

import TopicCardSort from './card';

const SortableItem = SortableElement(({topic}) => (
    <TopicCardSort topic={topic}/>
));

const SortableList = SortableContainer(({topics}) => (
    <div className="topic-sort-sortingItems">
        {
            topics.map((topic, i) => (
                <SortableItem key={i}
                              index={i}
                              topic={topic}/>
            ))
        }
    </div>
));

export default class TopicSorter extends React.Component {
    static propTypes = {
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
            topics: arrayMoveImmutable(this.state.topics, oldIndex, newIndex)
        });
    };

    _handleSavePriority = (event) => {
        event.preventDefault();

        this.props.updateTopicPriority(this.state.topics.map((topic) => topic['id']));
    };

    render() {
        return (
            <div className="topic-sort-sorting">
                <SortableList topics={this.state.topics}
                              useWindowAsScrollContainer={true}
                              onSortEnd={this._handleSortEndProduct}/>

                <div className="row">
                    <div className="col s12 m6 center-align">
                        <Button variant="outlined" size="small" component={Link} to={rootPath()}>
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
