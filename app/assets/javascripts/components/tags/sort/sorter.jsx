'use strict';

import {
    Link
} from 'react-router-dom';

import {
    SortableContainer,
    SortableElement,
    arrayMove
} from 'react-sortable-hoc';

const SortableItem = SortableElement(({tag}) => (
        <div key={tag.id}
             className="tag-sort-item">
            {tag.name}

            <span className="tag-count">
                {`(${tag.taggedArticlesCount})`}
            </span>
        </div>
    )
);

const SortableList = SortableContainer(({tags}) => (
        <div className="tag-sorting-items">
            {
                tags.map((tag, i) => (
                        <SortableItem key={`tag-sort-${tag.id}`}
                                      index={i}
                                      tag={tag}/>
                    )
                )
            }
        </div>
    )
);

export default class TagSorterDisplay extends React.Component {
    static propTypes = {
        // Tags must already be sorted by priority
        tags: PropTypes.array.isRequired,
        userSlug: PropTypes.string.isRequired,
        updateTagPriority: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    state = {
        tags: this.props.tags
    };

    _handleSortEndProduct = ({oldIndex, newIndex}) => {
        this.setState({
            tags: arrayMove(this.state.tags, oldIndex, newIndex)
        });
    };

    _handleSavePriority = (event) => {
        event.preventDefault();

        this.props.updateTagPriority(this.state.tags.map((tag) => tag['id']));
    };

    render() {
        return (
            <div className="tag-sorting">
                <div className="row tag-sorting-buttons">
                    <div className="col s12 m6 center-align">
                        <Link className="btn-flat waves-effect waves-teal"
                              to={`/tags/${this.props.userSlug}`}>
                            {I18n.t('js.helpers.buttons.cancel')}
                        </Link>
                    </div>

                    <div className="col s12 m6 center-align">
                        <a className="btn waves-effect waves-spectra"
                           href="#"
                           onClick={this._handleSavePriority}>
                            {I18n.t('js.helpers.buttons.apply')}
                        </a>
                    </div>
                </div>

                <SortableList tags={this.state.tags}
                              useWindowAsScrollContainer={true}
                              onSortEnd={this._handleSortEndProduct}/>
            </div>
        );
    }
}
