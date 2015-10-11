var Spinner = require('./spinner');

var InfiniteScroll = React.createClass({
    getDefaultProps: function () {
        return {
            pageStart: 1,
            hasMore: false,
            loadMore: function () {
            },
            threshold: 250
        };
    },

    componentDidMount: function () {
        this.pageLoaded = this.props.pageStart;
        this._attachScrollListener();
    },

    componentDidUpdate: function () {
        this._attachScrollListener();
    },

    _loader: function () {
        return (
            <div className={this.props.hasMore ? 'center': 'hide'}>
                <Spinner/>
            </div>
        );
    },

    render: function () {
        var props = this.props;
        return React.DOM.div(null, props.children, props.hasMore && (this._loader));
    },

    _scrollListener: function () {
        var topPosition = function (domElt) {
            if (!domElt) {
                return 0;
            }
            return domElt.offsetTop + topPosition(domElt.offsetParent);
        };

        var el = ReactDOM.findDOMNode(this);
        var scrollTop;
        if (window.pageYOffset !== undefined) {
            scrollTop = window.pageYOffset;
        } else {
            scrollTop = (document.documentElement || document.body.parentNode || document.body).scrollTop;
        }

        if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < Number(this.props.threshold)) {
            this._detachScrollListener();
            this.props.loadMore(this.pageLoaded += 1);
        }
    },

    _attachScrollListener: function () {
        if (!this.props.hasMore) {
            return;
        }
        window.addEventListener('scroll', this._scrollListener);
        window.addEventListener('resize', this._scrollListener);
        this._scrollListener();
    },

    _detachScrollListener: function () {
        window.removeEventListener('scroll', this._scrollListener);
        window.removeEventListener('resize', this._scrollListener);
    },

    componentWillUnmount: function () {
        this._detachScrollListener();
    }
});

module.exports = InfiniteScroll;
