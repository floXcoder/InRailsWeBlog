'use strict';

import {
    Helmet
} from 'react-helmet-async';

const HeadLayout = ({children: {title, description, author, canonical, og}}) => (
    <Helmet>
        <title>
            {title}
        </title>

        <meta itemProp="mainEntityOfPage"
              content={window.location}/>

        <meta name="description"
              content={description}/>

        {
            canonical &&
            <link rel="canonical"
                  href={canonical}/>
        }

        {
            author &&
            <meta property="author"
                  content={author}/>
        }

        {
            title &&
            <meta property="og:title"
                  content={title}/>
        }

        {
            (og && og.type) &&
            <meta property="og:type"
                  content={og.type}/>
        }

        {
            (og && og.url) &&
            <meta property="og:url"
                  content={og.url}/>
        }

        {
            (og && og.image) &&
            <meta property="og:image"
                  content={og.image || window.logoUrl}/>
        }
    </Helmet>
);

HeadLayout.propTypes = {
    children: PropTypes.object.isRequired
};

export default HeadLayout;
