'use strict';

// import AssociatedTagList from './list';

import Loader from '../../theme/loader';

function AssociatedTagBox({
                              hasMore
                          }) {
    return (
        <div className="center-align">
            {
                // this.state.associatedTags &&
                // <AssociatedTagList tags={this.state.associatedTags}
                //                    onClickTag={this._handleTagClick}/>
            }

            <div className={classNames({
                center: hasMore,
                hide: !hasMore
            })}>
                <Loader/>
            </div>
        </div>
    );
}

AssociatedTagBox.propTypes = {
    hasMore: PropTypes.bool
};

AssociatedTagBox.defaultProps = {
    hasMore: false
};

export default AssociatedTagBox;
