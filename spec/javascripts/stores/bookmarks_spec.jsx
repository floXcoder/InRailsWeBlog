'use strict';

import '../test_helper';

import reducers from '../../../app/assets/javascripts/reducers';
import * as BookmarkActions from '../../../app/assets/javascripts/actions/bookmarkActions';
import * as BookmarkSelectors from '../../../app/assets/javascripts/selectors/bookmarkSelectors';

describe('Bookmarks actions', () => {
    let store;
    beforeEach(() => {
        // Mock errors reporting
        mock('/errors', 200, () => ({}));

        store = buildStore(reducers);

        jest.useFakeTimers();

        global.Notification.alert.mockReset();
    });

    describe('bookmark', () => {
        it('should bookmark an article for the current user', () => {
            const currentUser = FactoryGenerator.create('users');
            const bookmarkedArticle = FactoryGenerator.create('articles');

            mock(`/api/v1/users/${currentUser.id}/bookmarks`, 200, () => ({
                    bookmark: {
                        id: 1,
                        userId: currentUser.id,
                        bookmarkedId: bookmarkedArticle.id,
                        bookmarkedType: 'article',
                        follow: false
                    }
                })
            );

            return dispatch(store, BookmarkActions.bookmark(currentUser.id, 'article', bookmarkedArticle.id))
                .then((state) => {
                    expect(BookmarkSelectors.getIsBookmarked(state, {
                        bookmarkId: 1,
                        bookmarkType: 'article'
                    })).toBe(true);
                });
        });

        it('should bookmark an article if user is not connected', () => {
            const bookmarkedArticle = FactoryGenerator.create('articles');

            const state = dispatch(store, BookmarkActions.bookmark(null, 'article', bookmarkedArticle.id));

            expect(BookmarkSelectors.getIsBookmarked(state, {
                bookmarkId: 1,
                bookmarkType: 'article'
            })).toBe(true);

            expect(global.Notification.alert).toHaveBeenCalledTimes(1);
        });

        it('should unbookmark an article for the current user', () => {
            const currentUser = FactoryGenerator.create('users');
            const bookmarkedArticle = FactoryGenerator.create('articles');
            const bookmark = {
                id: 1,
                userId: currentUser.id,
                bookmarkedId: bookmarkedArticle.id,
                bookmarkedType: 'article',
                follow: false
            };

            mock(`/api/v1/users/${currentUser.id}/bookmarks/${bookmark.id}`, 204);

            return dispatch(store, BookmarkActions.bookmark(currentUser.id, 'article', bookmarkedArticle.id, bookmark.id))
                .then((state) => {
                    expect(BookmarkSelectors.getIsBookmarked(state, {
                        bookmarkId: 1,
                        bookmarkType: 'article'
                    })).toBe(false);
                });
        });

        it('should unbookmark an article if user is not connected', () => {
            const currentUser = FactoryGenerator.create('users');
            const bookmarkedArticle = FactoryGenerator.create('articles');
            const bookmark = {
                id: 1,
                userId: currentUser.id,
                bookmarkedId: bookmarkedArticle.id,
                bookmarkedType: 'article',
                follow: false
            };

            const state = dispatch(store, BookmarkActions.bookmark(null, 'article', bookmarkedArticle.id, bookmark.id));

            expect(BookmarkSelectors.getIsBookmarked(state, {
                bookmarkId: 1,
                bookmarkType: 'article'
            })).toBe(false);

            expect(global.Notification.alert).toHaveBeenCalledTimes(1);
        });
    });

    afterEach(() => fetchMock.restore());
});
