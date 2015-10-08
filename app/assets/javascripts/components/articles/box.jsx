var ArticleForm = require('./form');
var ArticleList = require('./list');
var ArticleStore = require('../../stores/articleStore');
var UserStore = require('../../stores/userStore');

var Spinner = require('../../components/materialize/spinner');

var ArticleBox = React.createClass({
    // With specifying mixins we say that we'd like to connect this component's state with the ImageStore.
    // What this means is that whenever the store reacts to the action the component's state will be updated.
    mixins: [
        Reflux.listenTo(ArticleStore, 'onArticleChange'),
        Reflux.listenTo(UserStore, 'onChangeDisplay')
    ],

    getInitialState: function () {
        return {
            articles: null,
            isLoading: true,
            displayType: 'inline'
        };
    },

    onChangeDisplay(userStore) {
        var displayType = userStore.displayType;
        this.setState({
            displayType: displayType
        });
    },

    onArticleChange(articleStore) {
        this.setState({
            articles: articleStore.articles,
            isLoading: false
        });
    },

    _displayFormIfUser: function () {
        if (this.props.userConnected) {
            return (
                <ArticleForm/>
            );
        }
    },

    _displayListIfArticles: function () {
        if (this.state.articles) {
            return (
                <ArticleList articles={this.state.articles} displayType={this.state.displayType}/>
            );
        }
    },

    render: function () {
        return (
            <div className="blog-article-box">
                { this._displayFormIfUser() }
                <div className={this.state.isLoading ? 'center': 'hide'}>
                    <Spinner size='big'/>
                </div>
                { this._displayListIfArticles() }
            </div>
        );
    }
});

module.exports = ArticleBox;
