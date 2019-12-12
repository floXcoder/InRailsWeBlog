'use strict';

import '../test_helper';

import reducers from '../../../app/assets/javascripts/reducers';
import * as CommentActions from '../../../app/assets/javascripts/actions/commentActions';
import * as CommentSelectors from '../../../app/assets/javascripts/selectors/commentSelectors';

describe('Comments actions', () => {
    let store;
    beforeEach(() => {
        // Mock errors reporting
        mock('/errors', 200, () => ({}));

        store = buildStore(reducers);

        jest.useFakeTimers();
    });

    describe('fetchComments', () => {
        it('should fetch all comments', () => {
            const comments = FactoryGenerator.create('comments', {number: 3});

            mock('/api/v1/comments.json', 200, () => ({
                    comments: comments,
                    meta: {
                        pagination: {
                            currentPage: 1,
                            totalPages: 3,
                            totalCount: 26
                        }
                    }
                })
            );

            return dispatch(store, CommentActions.fetchComments({}))
                .then((state) => {
                    expect(state.commentState.comments).toHaveLength(comments.length);
                    expect(state.commentState.comments.first().id).toEqual(1);
                    expect(state.commentState.pagination.currentPage).toEqual(1);
                    expect(state.commentState.pagination.totalPages).toEqual(3);
                });
        });
    });

    describe('addComment', () => {
        it('should create a comment', () => {
            const newComment = FactoryGenerator.create('comments');

            mock('/api/v1/article/1/comments', 200, (request) => ({
                    comment: request.comment
                })
            );

            return dispatch(store, CommentActions.addComment(newComment, 'article', 1))
                .then((state) => {
                    expect(state.commentState.comments).toHaveLength(1);
                    expect(CommentSelectors.getCommentErrors(state)).toEqual(undefined);
                });
        });

        it('should not create a comment with errors', () => {
            const newComment = FactoryGenerator.create('comments');
            const titleError = 'too short';

            mock('/api/v1/article/1/comments', 422, () => ({
                    errors: {title: [titleError]}
                })
            );

            return dispatch(store, CommentActions.addComment(newComment, 'article', 1))
                .then((state) => {
                    expect(state.commentState.comments).toHaveLength(0);
                    expect(CommentSelectors.getCommentErrors(state)).toEqual([I18n.t('js.comment.model.title') + ' ' + titleError]);
                });
        });
    });

    describe('updateComment', () => {
        it('should update a comment', () => {
            const comment = FactoryGenerator.create('comments');
            const updateParameters = {title: 'Updated comment title'};

            mock(`/api/v1/article/1/comments`, 200, (request) => ({
                    comment: {...comment, ...request.comment}
                })
            );

            return dispatch(store, CommentActions.updateComment({id: comment.id, ...updateParameters}, 'article', 1))
                .then((state) => {
                    expect(state.commentState.comments).toHaveLength(1);
                    expect(CommentSelectors.getCommentErrors(state)).toEqual(undefined);
                });
        });
    });

    describe('deleteComment', () => {
        it('should delete a comment', () => {
            const comment = FactoryGenerator.create('comments');

            mock(`/api/v1/article/1/comments`, 202, () => ({
                    deletedCommentIds: [comment.id]
                })
            );

            return dispatch(store, CommentActions.deleteComment(comment.id, 'article', 1))
                .then((state) => {
                    expect(state.commentState.comments).toHaveLength(0);
                    expect(CommentSelectors.getCommentErrors(state)).toEqual(undefined);
                });
        });
    });

    afterEach(() => fetchMock.restore());
});
