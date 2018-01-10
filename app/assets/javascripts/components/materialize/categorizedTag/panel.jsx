'use strict';

import Category from './category';

export default class Panel extends React.Component {
    static propTypes = {
        categories: PropTypes.arrayOf(PropTypes.object).isRequired,
        selection: PropTypes.object.isRequired,
        onAdd: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
        hasAddNew: PropTypes.bool,
        addNewValue: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.categories.length === 0) {
            return null;
        }

        return (
            <div className="cti__panel cti__panel_arrow_top">
                {
                    this.props.categories.map((category, i) => (
                        <Category key={category.id}
                                  items={category.items}
                                  category={category.id}
                                  title={category.title}
                                  overhead={category.overhead}
                                  selected={this.props.selection.category === i}
                                  selectedItem={this.props.selection.item}
                                  value={this.props.value}
                                  hasAddNew={this.props.hasAddNew}
                                  type={category.type}
                                  onAdd={this.props.onAdd}
                                  isSingle={category.isSingle}
                                  addNewValue={this.props.addNewValue}/>
                    ))
                }
            </div>
        );
    }
}
