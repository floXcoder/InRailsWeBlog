'use strict';

import Spinner from './spinner';

export default class InfiniteScroll extends Reflux.Component {
    static propTypes = {
        pageStart: React.PropTypes.number,
        hasMore: React.PropTypes.bool,
        loadMore: React.PropTypes.func,
        threshold: React.PropTypes.number
    };

    static defaultProps = {
        pageStart: 1,
        hasMore: false,
        loadMore () {
        },
        threshold: 250
    };

    constructor(props) {
        super(props);

        this.pageLoaded = 0;
    }

    componentDidMount() {
        this.pageLoaded = this.props.pageStart;
        this._attachScrollListener();
    }

    componentWillUnmount() {
        this._detachScrollListener();
    }

    componentDidUpdate() {
        this._attachScrollListener();
    }

    _loader() {
        const loaderClass = classNames(
            {
                'center': this.props.hasMore,
                'hide': !this.props.hasMore
            }
        );

        return (
            <div className={loaderClass}>
                <Spinner/>
            </div>
        );
    }

    _scrollListener() {
        let topPosition = function (domElt) {
            if (!domElt) {
                return 0;
            }
            return domElt.offsetTop + topPosition(domElt.offsetParent);
        };

        let el = ReactDOM.findDOMNode(this);
        let scrollTop;
        if (window.pageYOffset !== undefined) {
            scrollTop = window.pageYOffset;
        } else {
            scrollTop = (document.documentElement || document.body.parentNode || document.body).scrollTop;
        }

        if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < Number(this.props.threshold)) {
            this._detachScrollListener();
            this.props.loadMore(this.pageLoaded += 1);
        }
    }

    _attachScrollListener() {
        if (!this.props.hasMore) {
            return;
        }
        window.addEventListener('scroll', this._scrollListener);
        window.addEventListener('resize', this._scrollListener);
        this._scrollListener();
    }

    _detachScrollListener() {
        window.removeEventListener('scroll', this._scrollListener);
        window.removeEventListener('resize', this._scrollListener);
    }

    render() {
        let props = this.props;
        return React.DOM.div(null, props.children, props.hasMore && (this._loader));
    }
}
