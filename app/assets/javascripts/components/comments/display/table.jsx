'use strict';

import CommentInlineDisplay from './inline';
import CommentFilterDisplay from './filter';

import Pagination from '../../materialize/pagination';

const CommentTableDisplay = ({comments, isLoading, hasFilter, filters, isInlineEditing, isPaginated, totalPages, onPaginationClick}) => (
    <div className="row comment-table">
        {
            hasFilter &&
            <div className="col s12">
                <CommentFilterDisplay filters={filters}/>
            </div>
        }

        {
            isInlineEditing &&
            <div className="col s12 center-align text-note">
                {I18n.t('js.comment.table.helper')}
            </div>
        }

        <div className="col s12">
            <div className="card">
                <table className="bordered highlight responsive-table">
                    <thead>
                    <tr>
                        <th data-field="commentable_type">
                            {I18n.t('js.comment.model.commentable_type')}
                        </th>
                        <th data-field="user">
                            {I18n.t('js.comment.model.user')}
                        </th>
                        <th data-field="title">
                            {I18n.t('js.comment.model.title')}
                        </th>
                        <th data-field="body">
                            {I18n.t('js.comment.model.body')}
                        </th>
                        <th data-field="posted_at">
                            {I18n.t('js.comment.model.posted_at')}
                        </th>
                        <th data-field="actions">
                            {I18n.t('js.comment.table.actions.button')}
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {
                        !isLoading && comments.map((comment, i) => (
                                <CommentInlineDisplay key={`${comment.id}-${i}`}
                                                      comment={comment}
                                                      isInlineEditing={isInlineEditing}/>
                            )
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>

        {
            !isLoading && comments.length === 0 &&
            <div className="col s12">
                <div className="card-panel center-align text-matisse">
                    {I18n.t('js.comment.common.no_data')}
                </div>
            </div>
        }

        {
            isLoading &&
            <div className="col s12">
                <div className="card-panel center-align text-matisse">
                    {I18n.t('js.comment.common.loading')}
                </div>
            </div>
        }

        {
            isPaginated &&
            <div className="col s12">
                <Pagination totalPages={totalPages}
                            onPaginationClick={onPaginationClick}/>
            </div>
        }
    </div>
);

CommentTableDisplay.propTypes = {
    comments: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    hasFilter: PropTypes.bool,
    filters: PropTypes.object,
    isInlineEditing: PropTypes.bool,
    isPaginated: PropTypes.bool,
    totalPages: PropTypes.number,
    onPaginationClick: PropTypes.func
};

CommentTableDisplay.defaultProps = {
    hasFilter: true,
    filters: {},
    isInlineEditing: true,
    isPaginated: true,
    totalPages: 0
};

export default CommentTableDisplay;
