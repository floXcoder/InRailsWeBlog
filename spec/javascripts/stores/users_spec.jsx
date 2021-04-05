'use strict';

import '../test_helper';

import reducers from '../../../app/assets/javascripts/reducers';
import * as UserActions from '../../../app/assets/javascripts/actions/userActions';
import * as UserSelectors from '../../../app/assets/javascripts/selectors/userSelectors';

describe('Users actions', () => {
    let store;
    beforeEach(() => {
        // Mock errors reporting
        mock('/errors', 200, () => ({}));

        store = buildStore(reducers);

        jest.useFakeTimers();
    });

    describe('fetchUsers', () => {
        it('should fetch users', () => {
            const users = FactoryGenerator.create('users', {number: 3});

            mock('/api/v1/users.json?locale=en', 200, () => ({
                    users,
                    meta: {
                        pagination: {
                            currentPage: 1,
                            totalPages: 1,
                            totalCount: 3
                        }
                    }
                })
            );

            return dispatch(store, UserActions.fetchUsers())
                .then((state) => {
                    expect(state.userState.users).toHaveLength(users.length);
                    expect(state.userState.users.first().id).toEqual(1);
                    expect(state.userState.pagination.currentPage).toEqual(1);
                    expect(state.userState.pagination.totalPages).toEqual(1);
                });
        });
    });

    describe('fetchUser', () => {
        it('should fetch a user', () => {
            const user = FactoryGenerator.create('users');

            mock(`/api/v1/users/${user.id}.json?locale=en`, 200, () => ({
                    user: user
                })
            );

            return dispatch(store, UserActions.fetchUser(user.id))
                .then((state) => {
                    expect(state.userState.user.id).toEqual(user.id);
                    expect(state.userState.user.email).toEqual(user.email);
                });
        });
    });

    describe('initUser', () => {
        it('should initialize user', () => {
            const user = FactoryGenerator.create('users');

            mock(`/api/v1/users/${user.id}.json?locale=en&profile=true`, 200, () => ({
                    user: user
                })
            );

            return dispatch(store, UserActions.initUser(user.id, {profile: true}))
                .then((state) => {
                    expect(state.userState.user.id).toEqual(user.id);
                    expect(state.userState.user.email).toEqual(user.email);
                });
        });
    });

    describe('validateUser', () => {
        it('should validate user', () => {
            const user = FactoryGenerator.create('users');

            mock('glob:/api/v1/users/validation.json?*', 200, () => ({
                    success: true
                })
            );

            return UserActions.validateUser(user.pseudo)
                .then((result) => {
                    expect(result.success).toBe(true);
                });
        });
    });

    describe('signupUser', () => {
        it('should sing up a user', () => {
            const user = FactoryGenerator.create('users');

            mock('/api/v1/signup.json', 200, () => ({
                    user
                })
            );

            return dispatch(store, UserActions.signupUser(user))
                .then((state) => {
                    expect(state.userState.user.id).toEqual(user.id);
                    expect(state.userState.user.email).toEqual(user.email);
                    expect(state.userState.isConnected).toBe(true);
                });
        });
    });

    describe('loginUser', () => {
        it('should login a user', () => {
            const user = FactoryGenerator.create('users');

            mock('/api/v1/login.json', 200, () => ({
                    user
                })
            );

            return dispatch(store, UserActions.loginUser(user))
                .then((state) => {
                    expect(state.userState.user.id).toEqual(user.id);
                    expect(state.userState.user.email).toEqual(user.email);
                    expect(state.userState.isConnected).toBe(true);
                });
        });
    });

    describe('updateUserSettings', () => {
        it('should update user settings', () => {
            const user = FactoryGenerator.create('users');

            mock(`/api/v1/users/${user.id}.json?locale=en`, 200, () => ({
                    user: user
                })
            );

            mock(`/api/v1/users/${user.id}/settings.json`, 200, () => ({
                    settings: {
                        articleDisplay: 'grid'
                    }
                })
            );

            dispatch(store, UserActions.fetchUser(user.id));

            return dispatch(store, UserActions.updateUserSettings(user.id, {
                articleDisplay: 'grid'
            }))
                .then((state) => {
                    expect(state.userState.user.settings.articleDisplay).toEqual('grid');
                });
        });
    });

    describe('fetchUserRecents', () => {
        it('should fetch user recent elements', () => {
            const user = FactoryGenerator.create('users');
            const articles = FactoryGenerator.create('articles', {number: 2});
            const tags = FactoryGenerator.create('tags', {number: 2});
            const topics = FactoryGenerator.create('topics', {number: 2});

            mock(`/api/v1/users/${user.id}/recents.json`, 200, () => ({
                    articles,
                    tags,
                    topics
                })
            );

            return dispatch(store, UserActions.fetchUserRecents(user.id))
                .then((state) => {
                    expect(UserSelectors.getUserRecentTags(state)).toHaveLength(tags.length);
                    expect(UserSelectors.getUserRecentArticles(state)).toHaveLength(articles.length);
                });
        });
    });

    afterEach(() => fetchMock.restore());
});
