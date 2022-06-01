'use strict';

import Category from './category';

function Panel(props) {
    if (props.categories.length === 0) {
        return null;
    }

    return (
        <div className="cti-panel cti-panel-arrow-top">
            {
                props.categories.map((category, i) => (
                    <Category key={category.id}
                              items={category.items}
                              category={category.id}
                              title={category.title}
                              overhead={category.overhead}
                              selected={props.selection.category === i}
                              selectedItem={props.selection.item}
                              value={props.value}
                              hasAddNew={props.hasAddNew}
                              type={category.type}
                              onAdd={props.onAdd}
                              isSingle={category.isSingle}
                              addNewPlaceholder={props.addNewPlaceholder}
                              addNewValue={props.addNewValue}/>
                ))
            }
        </div>
    );
}

Panel.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    selection: PropTypes.object.isRequired,
    onAdd: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    hasAddNew: PropTypes.bool,
    addNewPlaceholder: PropTypes.string,
    addNewValue: PropTypes.string
};

export default Panel;
