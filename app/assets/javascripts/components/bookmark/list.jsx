'use strict';

import {
    Link
} from 'react-router-dom';

import {
    getBookmarks
} from '../../selectors';

export default @connect((state) => ({
    bookmarks: getBookmarks(state)
}))
class BookmarkList extends React.Component {
    static propTypes = {
        // From connect
        bookmarks: PropTypes.array
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Loaded by user manager
        // this.props.fetchBookmarks();
    }

    render() {
        return (
            <div className="bookmarks-header">
                <div className="bookmarks-list">
                    <h3 className="bookmarks-header-title">
                        {I18n.t('js.bookmark.list.title')}
                    </h3>

                    {
                        this.props.bookmarks.length > 0
                            ?
                            <div className="margin-top-10">
                                {
                                    this.props.bookmarks.map((bookmark, i) => (
                                        <div key={i}
                                             className="row bookmarks-inline">
                                            <Link className="bookmarks-title"
                                                  to={`/article/${bookmark.slug}`}>
                                                <div className="col s2 bookmarks-icon">
                                                    <span className="material-icons"
                                                          data-icon="assignment"
                                                          aria-hidden="true"/>
                                                </div>

                                                <div className="col s10">

                                                    {bookmark.name || bookmark.slug}
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                }
                            </div>
                            :
                            <div className="bookmarks-none">
                                {I18n.t('js.bookmark.list.none')}
                            </div>
                    }
                </div>
            </div>
        );
    }
}

