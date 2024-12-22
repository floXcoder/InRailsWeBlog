import {useState} from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import Button from '@mui/material/Button';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import I18n from '@js/modules/translations';

import {
    rootPath
} from '@js/constants/routesHelper';

import TopicCardSort from '@js/components/topics/sort/card';


function SortableItem({
                          topic
                      }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: topic.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef}
             style={style}
             {...attributes}
             {...listeners}>
            <TopicCardSort topic={topic}/>
        </div>
    );
}

export default function TopicSorter({
                                        topics: initialTopics,
                                        updateTopicPriority
                                    }) {
    const [topics, setTopics] = useState(initialTopics);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const _handleDragEnd = (event) => {
        const {
            active,
            over
        } = event;

        if (active.id !== over.id) {
            setTopics((sortedTopics) => {
                const oldIndex = sortedTopics.findIndex((topic) => topic.id === active.id);
                const newIndex = sortedTopics.findIndex((topic) => topic.id === over.id);

                return arrayMove(sortedTopics, oldIndex, newIndex);
            });
        }
    };

    const _handleSavePriority = (event) => {
        event.preventDefault();

        updateTopicPriority(topics.map((topic) => topic.id));
    };

    return (
        <div className="topic-sort-sorting">
            <DndContext sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={_handleDragEnd}>
                <SortableContext items={topics.map((topic) => topic.id)}
                                 strategy={verticalListSortingStrategy}>
                    {
                        topics.map((topic) => (
                            <SortableItem key={topic.id}
                                          topic={topic}/>
                        ))
                    }
                </SortableContext>
            </DndContext>

            <div className="row margin-top-30">
                <div className="col s12 m6 center-align">
                    <Button variant="outlined"
                            size="small"
                            component={Link}
                            to={rootPath()}>
                        {I18n.t('js.helpers.buttons.cancel')}
                    </Button>
                </div>

                <div className="col s12 m6 center-align">
                    <Button color="primary"
                            variant="outlined"
                            onClick={_handleSavePriority}>
                        {I18n.t('js.helpers.buttons.apply')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

TopicSorter.propTypes = {
    // Topics must already be sorted by priority
    topics: PropTypes.array.isRequired,
    updateTopicPriority: PropTypes.func.isRequired
};