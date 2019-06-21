'use strict';

import Button from '@material-ui/core/Button';

import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

import arrayMove from 'array-move';

import {
    SortableContainer,
    SortableElement,
    sortableHandle
} from 'react-sortable-hoc';

import TopicFormInventoryFieldDisplay from './field';

const DragHandle = sortableHandle(() => <DragIndicatorIcon/>);

const SortableItem = SortableElement(({classes, index, field, onRemoveField}) => (
        <TopicFormInventoryFieldDisplay classes={classes}
                                        index={index}
                                        field={field}
                                        onRemoveField={onRemoveField}
                                        dragHandle={DragHandle}/>
    )
);

const SortableList = SortableContainer(({classes, fields, onRemoveField}) => (
        <div className={classes.sortingItems}>
            {
                fields.map((field, i) => (
                    <SortableItem key={`${field.fieldName}-${i}`}
                                  index={i}
                                  classes={classes}
                                  field={field}
                                  onRemoveField={onRemoveField}/>
                ))
            }
        </div>
    )
);

export default class TopicInventoryFieldSorter extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        // Fields must already be sorted by priority
        fields: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
    }

    state = {
        fields: this.props.fields || []
    };

    _handleAddField = (event) => {
        event.preventDefault();

        this.setState({
            fields: this.state.fields.concat({
                name: '',
                valueType: 'string_type',
                required: false,
                searchable: false,
                filterable: false
            })
        });
    };

    _handleRemoveField = (index, event) => {
        event.preventDefault();

        this.setState({
            fields: this.state.fields.removeIndex(index)
        });
    };

    _handleSortEndProduct = ({oldIndex, newIndex}) => {
        this.setState({
            fields: arrayMove(this.state.fields, oldIndex, newIndex).map((field, i) => {
                field.priority = i;
                return field;
            })
        });
    };

    render() {
        return (
            <>
                <div className="col s12">
                    <div className={this.props.classes.sorting}>
                        <SortableList classes={this.props.classes}
                                      fields={this.state.fields}
                                      onRemoveField={this._handleRemoveField}
                                      useDragHandle={true}
                                      useWindowAsScrollContainer={true}
                                      onSortEnd={this._handleSortEndProduct}/>
                    </div>
                </div>

                <div className="col s12 center-align margin-top-30 margin-bottom-50">
                    <Button color="primary"
                            variant="outlined"
                            size="small"
                            onClick={this._handleAddField}>
                        {I18n.t('js.topic.edit_inventories.add_field')}
                    </Button>
                </div>
            </>
        );
    }
}
