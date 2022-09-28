'use strict';

import {
    Helmet
} from 'react-helmet-async';

function HeadLayout({children}) {
    if (!children) {
        return null;
    }

    const {
        title,
        description,
        author,
        canonical,
        alternate,
        og,
        noindex
    } = children;

    return (
        <Helmet>
            <title>
                {title}
            </title>

            <meta itemProp="mainEntityOfPage"
                  content={window.location.origin + window.location.pathname}/>

            <meta name="description"
                  content={description}/>

            {
                !!noindex &&
                <meta name="robots"
                      content="noindex, nofollow"/>
            }

            {
                !!canonical &&
                <link rel="canonical"
                      href={canonical}/>
            }

            {
                !!alternate &&
                Object.keys(alternate)
                    .map((locale) => (
                        <link key={locale}
                              rel="alternate"
                              hrefLang={locale}
                              href={alternate[locale]}/>
                    ))
            }

            {
                !!author &&
                <meta property="author"
                      content={author}/>
            }

            {
                !!title &&
                <meta property="og:title"
                      content={title}/>
            }

            {
                !!(og?.type) &&
                <meta property="og:type"
                      content={og.type}/>
            }

            {
                !!(og?.url) &&
                <meta property="og:url"
                      content={og.url}/>
            }

            {
                !!(og?.image) &&
                <meta property="og:image"
                      content={og.image || window.logoUrl}/>
            }
        </Helmet>
    );
}

HeadLayout.propTypes = {
    children: PropTypes.object.isRequired
};

export default HeadLayout;
