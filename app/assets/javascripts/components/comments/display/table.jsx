'use strict';

const CommentInlineDisplay = require('./inline');
const CommentFilterDisplay = require('./filter');

const Pagination = require('../../materialize/pagination');

var CommentTableDisplay = ({comments, hasFilter, filters, isInlineEditing, isPaginated, totalPages, onPaginationClick}) => (
    <div className="row comment-table">
        {
            hasFilter &&
            <div className="col s12">
                <CommentFilterDisplay filters={filters}/>
            </div>
        }

        {
            isInlineEditing &&
            <div className="col s12 center-align">
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
                        comments.map((comment, i) =>
                            <CommentInlineDisplay key={i}
                                                  comment={comment}
                                                  isInlineEditing={isInlineEditing}/>
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>

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
    comments: React.PropTypes.array.isRequired,
    hasFilter: React.PropTypes.bool,
    filters: React.PropTypes.object,
    isInlineEditing: React.PropTypes.bool,
    isPaginated: React.PropTypes.bool,
    totalPages: React.PropTypes.number,
    onPaginationClick: React.PropTypes.func
};

CommentTableDisplay.defaultProps = {
    hasFilter: true,
    filters: {},
    isInlineEditing: true,
    isPaginated: true,
    totalPages: 0,
    onPaginationClick: null
};

module.exports = CommentTableDisplay;
