import {useState} from 'react';
import PropTypes from 'prop-types';

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

import TopicFormInventoryFieldDisplay from '@js/components/topics/display/inventories/field';


function SortableItem({
                          field,
                          index,
                          onRemoveField
                      }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: field.fieldName});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef}
             style={style}>
            <TopicFormInventoryFieldDisplay attributes={attributes}
                                            listeners={listeners}
                                            index={index}
                                            field={field}
                                            onRemoveField={onRemoveField}/>
        </div>
    );
}

export default function TopicInventoryFieldSorter({
                                                      fields: initialFields
                                                  }) {
    const [fields, setFields] = useState(initialFields || []);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const _handleAddField = (event) => {
        event.preventDefault();

        setFields(fields.concat({
            priority: fields.length,
            name: '',
            valueType: 'string_type',
            required: false,
            searchable: false,
            filterable: false
        }));
    };

    const _handleRemoveField = (index, event) => {
        event.preventDefault();

        setFields(fields.removeIndex(index));
    };

    const _handleDragEnd = (event) => {
        const {
            active,
            over
        } = event;

        if (active.id !== over.id) {
            setFields((sortedFields) => {
                const oldIndex = sortedFields.findIndex((field) => field.id === active.id);
                const newIndex = sortedFields.findIndex((field) => field.id === over.id);

                return arrayMove(sortedFields, oldIndex, newIndex)
                    .map((field, i) => {
                        field.priority = i;
                        return field;
                    });
            });
        }
    };

    return (
        <>
            <div className="col s12">
                <div className="topic-form-inv-sorting">
                    <DndContext sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={_handleDragEnd}>
                        <SortableContext items={fields.map((field) => field.priority)}
                                         strategy={verticalListSortingStrategy}>
                            {
                                fields.map((field, index) => (
                                    <SortableItem key={field.priority}
                                                  handle={true}
                                                  index={index}
                                                  field={field}
                                                  onRemoveField={_handleRemoveField}/>
                                ))
                            }
                        </SortableContext>
                    </DndContext>
                </div>
            </div>

            <div className="col s12 center-align margin-top-30 margin-bottom-50">
                <Button color="primary"
                        variant="outlined"
                        size="small"
                        onClick={_handleAddField}>
                    {I18n.t('js.topic.edit_inventories.add_field')}
                </Button>
            </div>
        </>
    );
}

TopicInventoryFieldSorter.propTypes = {
    // Fields must already be sorted by priority
    fields: PropTypes.array.isRequired
};