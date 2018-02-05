'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

const ArticleUserIcon = ({user}) => (
    <span className="blog-article-author">
        {I18n.t('js.article.common.user')}
        <Link className="blog-article-author-link"
              to={`/user/profile/${user.slug}`}
              itemType="https://schema.org/Person"
              itemScope={true}
              itemProp="author"
              onClick={spyTrackClick.bind(null, 'user', user.id)}>
                <span itemProp="name">
                    {user.pseudo}
                </span>
        </Link>
    </span>
);

ArticleUserIcon.propTypes = {
    user: PropTypes.object.isRequired
};

export default ArticleUserIcon;
