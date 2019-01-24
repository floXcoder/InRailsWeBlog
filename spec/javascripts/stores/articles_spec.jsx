'use strict';

import '../test_helper';

import reducers from '../../../app/assets/javascripts/reducers';
import * as ArticleActions from '../../../app/assets/javascripts/actions/articleActions';
import * as ArticleSelectors from '../../../app/assets/javascripts/selectors/articleSelectors';

describe('Articles actions', () => {
    let store;
    beforeEach(() => {
        // Mock errors reporting
        mock('/errors', 200, () => ({}));

        store = buildStore(reducers);

        jest.useFakeTimers();
    });

    describe('fetchArticles', () => {
        it('should fetch all articles', () => {
            const articles = FactoryGenerator.create('articles', {number: 3});

            mock('/api/v1/articles.json', 200, () => ({
                    articles: articles,
                    meta: {
                        pagination: {
                            currentPage: 1,
                            totalPages: 3,
                            totalCount: 26
                        }
                    }
                })
            );

            return dispatch(store, ArticleActions.fetchArticles())
                .then((state) => {
                    expect(ArticleSelectors.getArticles(state)).toHaveLength(articles.length);
                    expect(ArticleSelectors.getArticles(state).first().id).toEqual(1);
                    expect(ArticleSelectors.getArticlePagination(state).currentPage).toEqual(1);
                    expect(ArticleSelectors.getArticlePagination(state).totalPages).toEqual(3);
                });
        });
    });

    describe('fetchArticle', () => {
        it('should fetch one article', () => {
            const article = FactoryGenerator.create('articles');

            mock(`/api/v1/articles/${article.id}.json`, 200, () => ({
                    article: article
                })
            );

            return dispatch(store, ArticleActions.fetchArticle(article.id))
                .then((state) => {
                    expect(ArticleSelectors.getArticle(state).id).toEqual(article.id);
                    expect(ArticleSelectors.getArticle(state).title).toEqual(article.title);
                });
        });
    });

    describe('addArticle', () => {
        it('should create a article', () => {
            const newArticle = FactoryGenerator.create('articles');

            mock('/api/v1/articles', 200, (request) => ({
                    article: request.article
                })
            );

            return dispatch(store, ArticleActions.addArticle(newArticle))
                .then((state) => {
                    expect(ArticleSelectors.getArticle(state).title).toEqual(newArticle.title);
                    expect(ArticleSelectors.getArticle(state).user.id).toEqual(newArticle.user.id);
                    expect(ArticleSelectors.getArticleErrors(state)).toEqual([]);
                });
        });

        it('should not create a article with errors', () => {
            const newArticle = FactoryGenerator.create('articles');
            const contentError = 'too short';

            mock('/api/v1/articles', 422, () => ({
                    errors: {content: [contentError]}
                })
            );

            return dispatch(store, ArticleActions.addArticle(newArticle))
                .then((state) => {
                    expect(ArticleSelectors.getArticle(state)).toBeUndefined();
                    expect(ArticleSelectors.getArticleErrors(state)).toEqual([I18n.t('js.article.model.content') + ' ' + contentError]);
                });
        });
    });

    describe('inlineEditArticle', () => {
        it('should set inline editing article', () => {
            const article = FactoryGenerator.create('articles');

            const state = dispatch(store, ArticleActions.inlineEditArticle(article.id));

            expect(state.articleState.articleEditionId).toEqual(article.id);
        });
    });

    describe('updateArticle', () => {
        it('should update a article', () => {
            const article = FactoryGenerator.create('articles');
            const updateParameters = {content: 'Updated article content'};

            mock(`/api/v1/articles/${article.id}`, 200, (request) => ({
                    article: {...article, ...request.article}
                })
            );

            return dispatch(store, ArticleActions.updateArticle({id: article.id, ...updateParameters}))
                .then((state) => {
                    expect(ArticleSelectors.getArticle(state).content).toEqual(updateParameters.content);
                    expect(ArticleSelectors.getArticleErrors(state)).toEqual([]);
                });
        });
    });

    describe('updateArticlePriority', () => {
        it('should update priority for all articles', () => {
            const articles = FactoryGenerator.create('articles', {number: 5});

            mock('/api/v1/articles/priority', 200, (request) => ({
                    articles: request.articleIds.map((id) => articles.find((article) => article.id === id))
                })
            );

            return dispatch(store, ArticleActions.updateArticlePriority(articles.slice().reverse().map((article) => article.id)))
                .then((state) => {
                    expect(ArticleSelectors.getArticles(state)).toHaveLength(articles.length);
                    expect(ArticleSelectors.getArticles(state).first().id).toEqual(articles.last().id);
                    expect(ArticleSelectors.getArticles(state).last().id).toEqual(articles.first().id);
                });
        });
    });

    describe('deleteArticle', () => {
        it('should delete a article', () => {
            const article = FactoryGenerator.create('articles');

            mock(`/api/v1/articles/${article.id}`, 204);

            return dispatch(store, ArticleActions.deleteArticle(article.id))
                .then((state) => {
                    expect(ArticleSelectors.getArticle(state)).toBeUndefined();
                    expect(ArticleSelectors.getArticleErrors(state)).toEqual([]);
                });
        });
    });

    describe('fetchArticleHistory', () => {
        it('should fetch article history', () => {
            const article = FactoryGenerator.create('articles');
            const histories = FactoryGenerator.create('history', {number: 2});

            mock(`/api/v1/articles/${article.id}/history.json`, 200, () => ({
                    history: histories
                })
            );

            return dispatch(store, ArticleActions.fetchArticleHistory(article.id))
                .then((state) => {
                    expect(ArticleSelectors.getArticleVersions(state)).toHaveLength(histories.length);
                    expect(ArticleSelectors.getArticleVersions(state).first().articleId).toEqual(1);
                    expect(ArticleSelectors.getArticleVersions(state).first().changeset).toBeTruthy();
                });
        });
    });

    describe('restoreArticle', () => {
        it('should restore an article', () => {
            const articleRestored = FactoryGenerator.create('articles');

            mock(`/api/v1/articles/${articleRestored.id}/restore.json`, 200, () => ({
                    article: articleRestored
                })
            );

            return dispatch(store, ArticleActions.restoreArticle(articleRestored.id))
                .then((state) => {
                    expect(ArticleSelectors.getArticle(state).id).toEqual(articleRestored.id);
                    expect(ArticleSelectors.getArticle(state).title).toEqual(articleRestored.title);
                    expect(ArticleSelectors.getArticleVersions(state)).toBeUndefined();
                });
        });
    });

    afterEach(() => fetchMock.restore());
});
