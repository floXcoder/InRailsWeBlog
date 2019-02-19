'use strict';

import Chip from '@material-ui/core/Chip';

export default class SearchSelectedModule extends React.Component {
    static propTypes = {
        selectedTags: PropTypes.array.isRequired,
        onTagClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="search-category">
                <div className="tag-selected-list">
                    {
                        this.props.selectedTags.map((tag) => (
                            <Chip key={tag.id}
                                  label={tag.name}
                                  color="primary"
                                  variant="outlined"
                                  onClick={this.props.onTagClick.bind(null, tag)}/>
                        ))
                    }
                </div>
            </div>
        );
    }
}
