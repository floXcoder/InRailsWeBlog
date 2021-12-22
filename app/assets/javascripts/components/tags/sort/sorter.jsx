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
    showTagPath
} from '../../../constants/routesHelper';

const SortableItem = SortableElement(({tag}) => (
    <div key={tag.id}
         className="tag-sort-item">
        {tag.name}

        <span className="tag-count">
            {`(${tag.taggedArticlesCount})`}
        </span>
    </div>
));

const SortableList = SortableContainer(({tags}) => (
    <div className="tag-sorting-items">
        {
            tags.map((tag, i) => (
                <SortableItem key={i}
                              index={i}
                              tag={tag}/>
            ))
        }
    </div>
));

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
            tags: arrayMoveImmutable(this.state.tags, oldIndex, newIndex)
        });
    };

    _handleSavePriority = (event) => {
        event.preventDefault();

        this.props.updateTagPriority(this.state.tags.map((tag) => tag['id']));
    };

    render() {
        return (
            <div className="tag-sorting">
                <div className="row">
                    <div className="col s12 m6 center-align">
                        <Button
                            variant="outlined"
                            size="small"
                            component={Link}
                            to={showTagPath(this.props.userSlug)}>
                            {I18n.t('js.helpers.buttons.cancel')}
                        </Button>
                    </div>

                    <div className="col s12 m6 center-align">
                        <Button color="primary"
                                variant="contained"
                                size="small"
                                onClick={this._handleSavePriority}>
                            {I18n.t('js.helpers.buttons.apply')}
                        </Button>
                    </div>
                </div>

                <SortableList tags={this.state.tags}
                              useWindowAsScrollContainer={true}
                              onSortEnd={this._handleSortEndProduct}/>
            </div>
        );
    }
}
