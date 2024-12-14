import PropTypes from 'prop-types';

import classNames from 'classnames';

// import AssociatedTagList from '@js/components/tags/list';

import Loader from '@js/components/theme/loader';

function AssociatedTagBox({
                              hasMore = false
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

export default AssociatedTagBox;
