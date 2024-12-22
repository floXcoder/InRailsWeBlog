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
    showTagPath
} from '@js/constants/routesHelper';


function SortableItem({
    tag
                      }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: tag.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef}
             style={style}
             {...attributes}
             {...listeners}>
            <div key={tag.id}
                 className="tag-sort-item">
                {tag.name}

                <span className="tag-count">
                    {`(${tag.taggedArticlesCount})`}
                </span>
            </div>
        </div>
    );
}

export default function TagSorterDisplay({
                                             userSlug,
                                             tags: initialTags,
                                             updateTagPriority
                                         }) {
    const [tags, setTags] = useState(initialTags);
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
            setTags((sortedTags) => {
                const oldIndex = sortedTags.findIndex((tag) => tag.id === active.id);
                const newIndex = sortedTags.findIndex((tag) => tag.id === over.id);

                return arrayMove(sortedTags, oldIndex, newIndex);
            });
        }
    };

    const _handleSavePriority = (event) => {
        event.preventDefault();

        updateTagPriority(tags.map((tag) => tag.id));
    };

    return (
        <div className="tag-sorting">
            <div className="row">
                <div className="col s12 m6 center-align">
                    <Button
                        variant="outlined"
                        size="small"
                        component={Link}
                        to={showTagPath(userSlug)}>
                        {I18n.t('js.helpers.buttons.cancel')}
                    </Button>
                </div>

                <div className="col s12 m6 center-align">
                    <Button color="primary"
                            variant="contained"
                            size="small"
                            onClick={_handleSavePriority}>
                        {I18n.t('js.helpers.buttons.apply')}
                    </Button>
                </div>
            </div>

            <DndContext sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={_handleDragEnd}>
                <SortableContext items={tags.map((tag) => tag.id)}
                                 strategy={verticalListSortingStrategy}>
                    {
                        tags.map((tag) => (
                            <SortableItem key={tag.id}
                                          tag={tag}/>
                        ))
                    }
                </SortableContext>
            </DndContext>
        </div>
    );
}

TagSorterDisplay.propTypes = {
    userSlug: PropTypes.string.isRequired,
    // Tags must already be sorted by priority
    tags: PropTypes.array.isRequired,
    updateTagPriority: PropTypes.func.isRequired
};